import { SubscriptionPlan, PlanId } from "../types";
import { PlanDefinitions } from "../plans/plan-definitions";

export class PlanService {
  public static getAllPlans(): SubscriptionPlan[] {
    return PlanDefinitions.getAllPlans();
  }

  public static getPlan(planId: PlanId): SubscriptionPlan {
    return PlanDefinitions.getPlan(planId);
  }

  public static calculateUpgradeProration(
    currentPlanId: PlanId,
    newPlanId: PlanId,
    interval: "monthly" | "yearly"
  ): { currentPlanCredit: number; newPlanCharge: number; netProratedAmount: number } {
    const currentPlan = this.getPlan(currentPlanId);
    const newPlan = this.getPlan(newPlanId);

    const currentPrice = interval === "yearly" ? currentPlan.yearlyPriceUsd : currentPlan.monthlyPriceUsd;
    const newPrice = interval === "yearly" ? newPlan.yearlyPriceUsd : newPlan.monthlyPriceUsd;

    const netProratedAmount = Math.max(0, newPrice - currentPrice);

    return {
      currentPlanCredit: currentPrice,
      newPlanCharge: newPrice,
      netProratedAmount,
    };
  }
}
