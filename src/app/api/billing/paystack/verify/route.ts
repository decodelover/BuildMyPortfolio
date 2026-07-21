import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";
import { PaystackPaymentProvider } from "@/lib/billing-engine/providers/paystack-provider";
import { SubscriptionService } from "@/lib/billing-engine/services/subscription-service";
import { UsageService } from "@/lib/billing-engine/services/usage-service";
import { InvoiceService } from "@/lib/billing-engine/services/invoice-service";
import { CustomerService } from "@/lib/billing-engine/services/customer-service";
import { BillingEventBus } from "@/lib/billing-engine/events/billing-event-bus";
import { adminDb } from "@/lib/firebase/admin";
import { PlanId, BillingInterval } from "@/lib/billing-engine/types";
import { PlanDefinitions } from "@/lib/billing-engine/plans/plan-definitions";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const uid = await verifyToken(authHeader);

    const { reference, planId = "PRO", interval = "monthly" } = await request.json();

    if (!reference) {
      return NextResponse.json({ error: "Missing required transaction reference." }, { status: 400 });
    }

    const provider = new PaystackPaymentProvider();
    const verification = await provider.verifyTransaction(reference);

    if (!verification.status || verification.data?.status !== "success") {
      return NextResponse.json(
        { error: verification.message || "Payment verification failed or transaction unpaid." },
        { status: 400 }
      );
    }

    const customerEmail = verification.data?.customer?.email || "user@buildmyportfolio.com";
    const customerName = customerEmail.split("@")[0];

    CustomerService.getOrCreateCustomer(uid, customerEmail, customerName);

    // Update domain subscription state
    const subscription = SubscriptionService.updateSubscription(uid, {
      planId: planId as PlanId,
      interval: interval as BillingInterval,
      provider: "paystack",
      status: "active",
      customerProviderId: verification.data?.customer?.customer_code,
      subscriptionProviderId: reference,
    });

    // Reset usage quota for the new active billing period
    UsageService.resetMonthlyUsage(uid);

    // Generate Invoice record
    const plan = PlanDefinitions.getPlan(planId);
    const invoice = InvoiceService.createInvoice({
      userId: uid,
      subscriptionId: subscription.subscriptionId,
      customerName,
      customerEmail,
      items: [
        {
          id: `item-${planId}`,
          description: `${plan.name} Plan Paystack Subscription (${interval})`,
          amount: (verification.data?.amount || 3900) / 100,
          quantity: 1,
        },
      ],
    });

    // Firestore Synchronization
    if (adminDb) {
      const subRef = adminDb.collection("subscriptions").doc(uid);
      await subRef.set(
        {
          userId: uid,
          planId: plan.planId,
          provider: "paystack",
          status: "active",
          interval,
          currentPeriodStart: subscription.currentPeriodStart,
          currentPeriodEnd: subscription.currentPeriodEnd,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      const payRef = adminDb.collection("payments").doc(reference);
      await payRef.set({
        paymentId: reference,
        userId: uid,
        subscriptionId: subscription.subscriptionId,
        amount: invoice.total,
        currency: invoice.currency,
        status: "succeeded",
        provider: "paystack",
        createdAt: new Date().toISOString(),
      });
    }

    // Emit domain billing event
    BillingEventBus.emit(uid, "PaymentRecorded", {
      reference,
      planId,
      provider: "paystack",
    });

    return NextResponse.json({
      status: "success",
      subscription,
      invoice,
    });
  } catch (error: any) {
    console.error("Paystack Verification Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify Paystack transaction." },
      { status: 500 }
    );
  }
}
