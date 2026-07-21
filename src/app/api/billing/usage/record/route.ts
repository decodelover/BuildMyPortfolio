import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { PortfolioBillingEngine } from "@/lib/billing-engine/engine/portfolio-billing-engine";
import { UsageMetricKey } from "@/lib/billing-engine/services/usage-service";

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { metric, amount = 1 } = body as { metric: UsageMetricKey; amount?: number };

    if (!metric) {
      return NextResponse.json({ error: "Missing required resource metric field." }, { status: 400 });
    }

    const subscription = PortfolioBillingEngine.getUserSubscription(userId);
    const plan = PortfolioBillingEngine.getPlan(subscription.planId);

    // Map metric to plan limit property
    let maxLimit = 9999;
    if (metric === "aiCreditsUsed") maxLimit = plan.limits.aiCreditsPerMonth;
    else if (metric === "portfoliosCount") maxLimit = plan.limits.portfoliosCount;
    else if (metric === "resumesExported") maxLimit = plan.limits.resumeExportsPerMonth;
    else if (metric === "customDomainsCount") maxLimit = plan.limits.customDomainsCount;
    else if (metric === "storageMbUsed") maxLimit = plan.limits.storageMb;

    // Server-side validation check
    const validation = PortfolioBillingEngine.validateLimits(userId, metric, amount, maxLimit);
    if (!validation.allowed) {
      return NextResponse.json(
        {
          error: `Quota limit exceeded for ${String(metric)}. Allowed: ${maxLimit}, Requested: ${amount}, Current: ${validation.current}.`,
          validation,
        },
        { status: 429 }
      );
    }

    // Increment in-memory engine
    const updatedUsage = PortfolioBillingEngine.recordUsage(userId, metric, amount);

    // Sync to Firestore transactionally if DB is connected
    if (adminDb) {
      try {
        const usageRef = adminDb.collection("usage").doc(userId);
        await usageRef.set(
          {
            ...updatedUsage,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (_dbErr) {
        console.warn("Firestore usage document sync skipped in dev mode.");
      }
    }

    const alert = PortfolioBillingEngine.getUsageThresholdAlert(userId, metric, maxLimit);

    return NextResponse.json({
      status: "success",
      userId,
      updatedUsage,
      alert,
    });
  } catch (error: any) {
    console.error("Usage record API error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error." }, { status: 500 });
  }
}
