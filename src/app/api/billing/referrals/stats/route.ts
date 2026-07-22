import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { ReferralService } from "@/lib/billing-engine/promotions/referral-service";

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

    const stats = ReferralService.getReferralStats(userId);

    return NextResponse.json({
      status: "success",
      stats,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Internal server error." }, { status: 500 });
  }
}
