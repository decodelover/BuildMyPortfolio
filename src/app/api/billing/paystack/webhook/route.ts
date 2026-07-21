import { NextRequest, NextResponse } from "next/server";
import { PaystackPaymentProvider } from "@/lib/billing-engine/providers/paystack-provider";
import { SubscriptionService } from "@/lib/billing-engine/services/subscription-service";
import { UsageService } from "@/lib/billing-engine/services/usage-service";
import { InvoiceService } from "@/lib/billing-engine/services/invoice-service";
import { BillingEventBus } from "@/lib/billing-engine/events/billing-event-bus";
import { adminDb } from "@/lib/firebase/admin";
import { PlanId } from "@/lib/billing-engine/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature") || "";

    const provider = new PaystackPaymentProvider();
    const isValid = provider.verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid HMAC SHA512 webhook signature." }, { status: 400 });
    }

    const payload = JSON.parse(rawBody || "{}");
    const eventType = payload.event || "unknown_event";
    const data = payload.data || {};
    const metadata = data.metadata || {};
    const userId = metadata.userId || data.customer?.metadata?.userId || "guest_user";
    const eventId = `evt_pst_${data.id || Date.now()}_${eventType}`;

    // Idempotency check using Firestore
    if (adminDb) {
      const eventRef = adminDb.collection("billing_events").doc(eventId);
      const eventSnap = await eventRef.get();

      if (eventSnap.exists) {
        return NextResponse.json({ status: "ignored", message: "Duplicate webhook event already processed." });
      }

      await eventRef.set({
        eventId,
        userId,
        eventType,
        payload: data,
        processedAt: new Date().toISOString(),
      });
    }

    // Handle event types
    switch (eventType) {
      case "charge.success": {
        const planId = (metadata.planId || "PRO") as PlanId;
        const interval = metadata.interval || "monthly";

        SubscriptionService.updateSubscription(userId, {
          planId,
          interval,
          provider: "paystack",
          status: "active",
        });

        UsageService.resetMonthlyUsage(userId);

        InvoiceService.createInvoice({
          userId,
          subscriptionId: `sub_pst_${data.reference || Date.now()}`,
          customerName: data.customer?.first_name || "Customer",
          customerEmail: data.customer?.email || "customer@buildmyportfolio.com",
          items: [
            {
              id: `item-${planId}`,
              description: `Paystack Payment for ${planId} plan`,
              amount: (data.amount || 3900) / 100,
              quantity: 1,
            },
          ],
        });

        BillingEventBus.emit(userId, "PaymentRecorded", { reference: data.reference, amount: data.amount });
        break;
      }

      case "subscription.create":
      case "customer.subscription.create": {
        SubscriptionService.updateSubscription(userId, {
          status: "active",
          subscriptionProviderId: data.subscription_code,
        });
        BillingEventBus.emit(userId, "SubscriptionCreated", { code: data.subscription_code });
        break;
      }

      case "subscription.disable":
      case "customer.subscription.disable": {
        SubscriptionService.cancelSubscription(userId, true);
        BillingEventBus.emit(userId, "SubscriptionCancelled", { code: data.subscription_code });
        break;
      }

      case "invoice.payment_failed":
      case "charge.failed": {
        SubscriptionService.updateSubscription(userId, {
          status: "past_due",
          gracePeriodEnd: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
        });
        break;
      }

      default:
        console.log(`[Paystack Webhook] Unhandled event type: ${eventType}`);
        break;
    }

    return NextResponse.json({ status: "success", eventType });
  } catch (error: any) {
    console.error("Paystack Webhook Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process Paystack webhook event." },
      { status: 500 }
    );
  }
}
