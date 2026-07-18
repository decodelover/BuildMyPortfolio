import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";
import { db } from "@/lib/firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { OrchestratorService } from "@/lib/ai/orchestrator/orchestrator-service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate Request
    const authHeader = request.headers.get("authorization");
    const uid = await verifyToken(authHeader);

    // 2. Parse Request Body
    const { builderId, planId } = await request.json();
    if (!builderId || !planId) {
      return NextResponse.json(
        { error: "Missing required fields: builderId and planId are required." },
        { status: 400 }
      );
    }

    // 3. Fetch Website Builder session details
    const builderRef = doc(db, "websiteBuilders", builderId);
    const builderSnap = await getDoc(builderRef);
    if (!builderSnap.exists()) {
      return NextResponse.json({ error: "Website builder session not found." }, { status: 404 });
    }
    const builderData = builderSnap.data();
    if (builderData.userId !== uid) {
      return NextResponse.json({ error: "Unauthorized access to website builder draft." }, { status: 403 });
    }

    // 4. Fetch Generation Plan details
    const planRef = doc(db, "websitePlans", planId);
    const planSnap = await getDoc(planRef);
    if (!planSnap.exists()) {
      return NextResponse.json({ error: "Website generation plan not found." }, { status: 404 });
    }
    const planData = planSnap.data();

    // 5. Generate unique jobId
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    // 6. Execute orchestration workflow asynchronously
    // In serverless environments, this runs as a background promise while the client polls the Firestore state.
    OrchestratorService.executeWorkflow({
      jobId,
      userId: uid,
      builderId,
      planId,
      websiteData: builderData.websiteData || {},
      plan: planData
    }).catch((err) => {
      console.error(`[Background Orchestration Error] Job ${jobId} execution failed:`, err);
    });

    // 7. Return immediately with the queued status and jobId
    return NextResponse.json({
      jobId,
      status: "queued"
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
