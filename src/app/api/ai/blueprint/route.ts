import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";
import { adminDb } from "@/lib/firebase/admin";
import { generateBlueprint } from "@/lib/ai/gemini";
import { FieldValue } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate Request
    const authHeader = request.headers.get("authorization");
    const uid = await verifyToken(authHeader);

    // 2. Parse Request Body
    const { builderId, websiteData } = await request.json();
    if (!websiteData) {
      return NextResponse.json(
        { error: "Invalid request payload: websiteData is required" },
        { status: 400 }
      );
    }

    if (!adminDb) {
      return NextResponse.json(
        { error: "Internal server error: Firestore database service is offline" },
        { status: 500 }
      );
    }

    // 3. Check and Deduct AI Credits (Atomic Transaction)
    const userRef = adminDb.collection("users").doc(uid);
    let creditsRemaining = 0;
    
    const transactionResult = await adminDb.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new Error("USER_NOT_FOUND");
      }
      
      const userData = userDoc.data() || {};
      const currentCredits = typeof userData.aiCredits === "number" ? userData.aiCredits : 100;
      
      if (currentCredits < 1) {
        throw new Error("INSUFFICIENT_CREDITS");
      }
      
      const nextCredits = currentCredits - 1;
      transaction.update(userRef, {
        aiCredits: nextCredits,
        updatedAt: FieldValue.serverTimestamp(),
      });
      
      creditsRemaining = nextCredits;
      return true;
    });

    if (!transactionResult) {
      return NextResponse.json(
        { error: "Failed to process credit deduction transaction" },
        { status: 500 }
      );
    }

    // 4. Generate Blueprint using Gemini
    const blueprint = await generateBlueprint(websiteData);

    // 5. Cache Blueprint in Website Builder Document (if builderId provided)
    if (builderId) {
      const builderRef = adminDb.collection("websiteBuilders").doc(builderId);
      await builderRef.update({
        aiBlueprint: blueprint,
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    // 6. Return response with remaining credits metadata
    return NextResponse.json({
      blueprint,
      creditsRemaining,
    });

  } catch (error: any) {
    console.error("AI Website Blueprint Route Error:", error);
    
    if (error.message === "USER_NOT_FOUND") {
      return NextResponse.json({ error: "Authenticated user document not found in database" }, { status: 404 });
    }
    if (error.message === "INSUFFICIENT_CREDITS") {
      return NextResponse.json({ error: "Insufficient AI credits. Please upgrade your plan." }, { status: 403 });
    }
    if (error.message && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: error.message || "Failed to generate website blueprint" },
      { status: 500 }
    );
  }
}
