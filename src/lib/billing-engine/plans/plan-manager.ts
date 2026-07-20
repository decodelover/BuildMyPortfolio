import { SubscriptionPlan, PlanId } from "../types";
import { BillingConfig } from "../config/billing-config";
import { SubscriptionError } from "../errors/billing-errors";

export class PlanManager {
  public static getAllPlans(): SubscriptionPlan[] {
    return BillingConfig.plans;
  }

  public static getPlan(planId: PlanId): SubscriptionPlan {
    const plan = BillingConfig.plans.find((p) => p.planId === planId);
    if (!plan) {
      throw new SubscriptionError(`Subscription plan '${planId}' is not defined.`);
    }
    return plan;
  }

  public static calculatePrice(planId: PlanId, interval: "monthly" | "yearly"): number {
    const plan = this.getPlan(planId);
    return interval === "yearly" ? plan.yearlyPriceUsd : plan.monthlyPriceUsd;
  }
}
