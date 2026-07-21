import { Coupon, PlanId } from "../types";
import { InvalidCouponError } from "../errors/billing-errors";

export class CouponEngine {
  private static coupons = new Map<string, Coupon>([
    [
      "LAUNCH20",
      {
        code: "LAUNCH20",
        discountType: "percentage",
        amount: 20,
        validUntil: "2030-12-31T23:59:59Z",
        redemptionsCount: 0
      }
    ],
    [
      "PROMO10",
      {
        code: "PROMO10",
        discountType: "fixed",
        amount: 10,
        validUntil: "2030-12-31T23:59:59Z",
        redemptionsCount: 0
      }
    ]
  ]);

  public static validateAndApplyCoupon(code: string, originalPrice: number, _planId?: PlanId): { discountAmount: number; coupon: Coupon } {
    const coupon = this.coupons.get(code.toUpperCase());
    if (!coupon) {
      throw new InvalidCouponError(code, "Promo code does not exist.");
    }

    if (new Date(coupon.validUntil).getTime() < Date.now()) {
      throw new InvalidCouponError(code, "Promo code has expired.");
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = Math.round(((originalPrice * coupon.amount) / 100) * 100) / 100;
    } else {
      discountAmount = Math.min(originalPrice, coupon.amount);
    }

    return { discountAmount, coupon };
  }
}
