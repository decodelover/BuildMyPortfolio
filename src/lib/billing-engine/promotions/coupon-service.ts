import { Coupon, CouponRedemption, PlanId } from "../types";
import { InvalidCouponError } from "../errors/billing-errors";

export class CouponService {
  private static coupons = new Map<string, Coupon>([
    [
      "LAUNCH20",
      {
        code: "LAUNCH20",
        discountType: "percentage",
        amount: 20,
        validUntil: "2030-12-31T23:59:59Z",
        redemptionsCount: 0,
        maxRedemptions: 1000,
        isActive: true,
      },
    ],
    [
      "WELCOME50",
      {
        code: "WELCOME50",
        discountType: "percentage",
        amount: 50,
        validUntil: "2030-12-31T23:59:59Z",
        redemptionsCount: 0,
        maxRedemptions: 500,
        isActive: true,
      },
    ],
    [
      "PROMO10",
      {
        code: "PROMO10",
        discountType: "fixed",
        amount: 10,
        validUntil: "2030-12-31T23:59:59Z",
        redemptionsCount: 0,
        maxRedemptions: 200,
        isActive: true,
      },
    ],
    [
      "FREEPRO",
      {
        code: "FREEPRO",
        discountType: "first_month_free",
        amount: 100,
        validUntil: "2030-12-31T23:59:59Z",
        redemptionsCount: 0,
        applicablePlans: ["PRO"],
        isActive: true,
      },
    ],
  ]);

  private static redemptions = new Map<string, CouponRedemption[]>();

  public static validateCoupon(code: string, originalPrice: number, planId?: PlanId): { discountAmount: number; coupon: Coupon } {
    const coupon = this.coupons.get(code.toUpperCase());
    if (!coupon || !coupon.isActive) {
      throw new InvalidCouponError(code, "Promo code does not exist or is inactive.");
    }

    if (new Date(coupon.validUntil).getTime() < Date.now()) {
      throw new InvalidCouponError(code, "Promo code has expired.");
    }

    if (coupon.maxRedemptions && coupon.redemptionsCount >= coupon.maxRedemptions) {
      throw new InvalidCouponError(code, "Promo code maximum usage limit reached.");
    }

    if (coupon.applicablePlans && planId && !coupon.applicablePlans.includes(planId)) {
      throw new InvalidCouponError(code, `Promo code is only valid for ${coupon.applicablePlans.join(", ")} plans.`);
    }

    if (coupon.minPurchaseAmount && originalPrice < coupon.minPurchaseAmount) {
      throw new InvalidCouponError(code, `Minimum purchase amount of $${coupon.minPurchaseAmount} required.`);
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage" || coupon.discountType === "first_month_free") {
      discountAmount = Math.round(((originalPrice * coupon.amount) / 100) * 100) / 100;
    } else if (coupon.discountType === "fixed") {
      discountAmount = Math.min(originalPrice, coupon.amount);
    }

    return { discountAmount, coupon };
  }

  public static redeemCoupon(code: string, userId: string, originalPrice: number, invoiceId?: string, planId?: PlanId): CouponRedemption {
    const { discountAmount, coupon } = this.validateCoupon(code, originalPrice, planId);

    // Increment redemption counter
    coupon.redemptionsCount += 1;

    const redemption: CouponRedemption = {
      redemptionId: `red-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      code: coupon.code,
      userId,
      redeemedAt: new Date().toISOString(),
      discountApplied: discountAmount,
      invoiceId,
    };

    const userRedemptions = this.redemptions.get(userId) || [];
    userRedemptions.push(redemption);
    this.redemptions.set(userId, userRedemptions);

    return redemption;
  }

  public static getUserRedemptions(userId: string): CouponRedemption[] {
    return this.redemptions.get(userId) || [];
  }
}
