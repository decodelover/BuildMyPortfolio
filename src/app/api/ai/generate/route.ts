import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";
import { adminDb } from "@/lib/firebase/admin";
import { OrchestratorService } from "@/lib/ai/orchestrator/orchestrator-service";
import { SubscriptionService } from "@/lib/billing-engine/services/subscription-service";
import { UsageService } from "@/lib/billing-engine/services/usage-service";
import { PermissionService } from "@/lib/billing-engine/services/permission-service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate Request
    const authHeader = request.headers.get("authorization");
    const uid = await verifyToken(authHeader);

    // 2. Server-side Feature Permission & Usage Quota Check
    const subscription = SubscriptionService.getUserSubscription(uid);
    const usage = UsageService.getUsage(uid);
    const permission = PermissionService.canUseAI(subscription, usage, 1);

    if (!permission.allowed) {
      return NextResponse.json(
        {
          error: permission.reason || "Monthly AI generation credit limit reached.",
          limitExceeded: true,
          currentUsage: permission.currentUsage,
          limit: permission.limit,
        },
        { status: 403 }
      );
    }

    // 3. Parse Request Body
    const { builderId, planId } = await request.json();
    if (!builderId || !planId) {
      return NextResponse.json(
        { error: "Missing required fields: builderId and planId are required." },
        { status: 400 }
      );
    }

    if (!adminDb) {
      return NextResponse.json(
        { error: "Internal server error: Database service unavailable." },
        { status: 500 }
      );
    }

    // 4. Fetch Website Builder session details
    const builderRef = adminDb.collection("websiteBuilders").doc(builderId);
    const builderSnap = await builderRef.get();
    if (!builderSnap.exists) {
      return NextResponse.json({ error: "Website builder session not found." }, { status: 404 });
    }
    const builderData = builderSnap.data() || {};
    if (builderData.userId !== uid) {
      return NextResponse.json({ error: "Unauthorized access to website builder draft." }, { status: 403 });
    }

    // 5. Fetch Generation Plan details
    const planRef = adminDb.collection("websitePlans").doc(planId);
    const planSnap = await planRef.get();
    if (!planSnap.exists) {
      return NextResponse.json({ error: "Website generation plan not found." }, { status: 404 });
    }
    const planData = planSnap.data();

    // 6. Record usage metric
    UsageService.recordUsage(uid, "aiCreditsUsed", 1);

    // 7. Generate unique jobId
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    // 8. Execute orchestration workflow asynchronously
    OrchestratorService.executeWorkflow({
      jobId,
      userId: uid,
      builderId,
      planId,
      websiteData: builderData.websiteData || {},
      plan: planData as any,
    }).catch((err) => {
      console.error(`[Background Orchestration Error] Job ${jobId} execution failed:`, err);
    });

    // 9. Return immediately with queued status and jobId
    return NextResponse.json({
      jobId,
      status: "queued",
    });
  } catch (error: any) {
    console.error("Orchestrator API Route Error:", error);
    if (error.message && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: error.message || "Failed to initiate generation process." },
      { status: 500 }
    );
  }
}
