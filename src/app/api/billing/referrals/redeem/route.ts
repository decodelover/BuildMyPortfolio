import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { ReferralService } from "@/lib/billing-engine/promotions/referral-service";

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
    const { rewardId } = body as { rewardId: string };

    if (!rewardId) {
      return NextResponse.json({ error: "Missing required rewardId parameter." }, { status: 400 });
    }

    const result = ReferralService.claimReward(userId, rewardId);

    return NextResponse.json({
      status: "success",
      userId,
      result,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to claim referral reward." }, { status: 400 });
  }
}
