import { NextRequest, NextResponse } from "next/server";
import { CouponService } from "@/lib/billing-engine/promotions/coupon-service";
import { PlanId } from "@/lib/billing-engine/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, originalPrice = 39, planId } = body as { code: string; originalPrice?: number; planId?: PlanId };

    if (!code) {
      return NextResponse.json({ error: "Missing required coupon promo code." }, { status: 400 });
    }

    const { discountAmount, coupon } = CouponService.validateCoupon(code, originalPrice, planId);
    const finalPrice = Math.max(0, originalPrice - discountAmount);

    return NextResponse.json({
      status: "success",
      code: coupon.code,
      discountType: coupon.discountType,
      discountAmount,
      originalPrice,
      finalPrice,
      validUntil: coupon.validUntil,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Invalid coupon promo code." }, { status: 400 });
  }
}
