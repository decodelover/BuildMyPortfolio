import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { CouponService } from "@/lib/billing-engine/promotions/coupon-service";
import { PlanId } from "@/lib/billing-engine/types";

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
    const { code, originalPrice = 39, invoiceId, planId } = body as {
      code: string;
      originalPrice?: number;
      invoiceId?: string;
      planId?: PlanId;
    };

    if (!code) {
      return NextResponse.json({ error: "Missing required promo code." }, { status: 400 });
    }

    const redemption = CouponService.redeemCoupon(code, userId, originalPrice, invoiceId, planId);

    return NextResponse.json({
      status: "success",
      userId,
      redemption,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to redeem coupon promo code." }, { status: 400 });
  }
}
