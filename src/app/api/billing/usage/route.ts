import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { PortfolioBillingEngine } from "@/lib/billing-engine/engine/portfolio-billing-engine";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized access request." }, { status: 401 });
    }

    if (!adminAuth) {
      return NextResponse.json({ error: "Firebase Admin Auth not initialized." }, { status: 500 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const usage = PortfolioBillingEngine.getUserUsage(userId);
    const subscription = PortfolioBillingEngine.getUserSubscription(userId);
    const plan = PortfolioBillingEngine.getPlan(subscription.planId);

    const limits = plan.limits;

    const alerts = {
      aiCredits: PortfolioBillingEngine.getUsageThresholdAlert(userId, "aiCreditsUsed", limits.aiCreditsPerMonth),
      portfolios: PortfolioBillingEngine.getUsageThresholdAlert(userId, "portfoliosCount", limits.portfoliosCount),
      resumes: PortfolioBillingEngine.getUsageThresholdAlert(userId, "resumesExported", limits.resumeExportsPerMonth),
      domains: PortfolioBillingEngine.getUsageThresholdAlert(userId, "customDomainsCount", limits.customDomainsCount),
      storage: PortfolioBillingEngine.getUsageThresholdAlert(userId, "storageMbUsed", limits.storageMb),
    };

    return NextResponse.json({
      status: "success",
      userId,
      usage,
      limits,
      planId: plan.planId,
      alerts,
    });
  } catch (error: any) {
    console.error("Usage GET API error:", error);
    return NextResponse.json({ error: error?.message || "Internal usage server error." }, { status: 500 });
  }
}
