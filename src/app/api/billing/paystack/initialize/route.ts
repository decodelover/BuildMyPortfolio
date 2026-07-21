import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";
import { PaystackPaymentProvider } from "@/lib/billing-engine/providers/paystack-provider";
import { PlanService } from "@/lib/billing-engine/services/plan-service";
import { PlanId, BillingInterval } from "@/lib/billing-engine/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const uid = await verifyToken(authHeader);

    const { planId, interval = "monthly", email } = await request.json();

    if (!planId) {
      return NextResponse.json({ error: "Missing required field: planId is required." }, { status: 400 });
    }

    const plan = PlanService.getPlan(planId as PlanId);
    const price = interval === "yearly" ? plan.yearlyPriceUsd : plan.monthlyPriceUsd;

    const provider = new PaystackPaymentProvider();
    const session = await provider.createCheckoutSession(
      uid,
      email || "user@buildmyportfolio.com",
      plan.planId,
      interval as BillingInterval,
      price,
      plan.currency
    );

    return NextResponse.json({
      status: "success",
      session,
    });
  } catch (error: any) {
    console.error("Paystack Initialize Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initialize Paystack checkout transaction." },
      { status: 500 }
    );
  }
}
