import { UserSubscription, PlanId } from "../types";
import { BillingConfig } from "../config/billing-config";
import { SubscriptionManager } from "./subscription-manager";

export class TrialManager {
  public static startTrial(userId: string, planId: PlanId): UserSubscription {
    const now = new Date();
    const trialEnd = new Date(now.getTime() + BillingConfig.trialDurationDays * 24 * 3600 * 1000);

    const sub = SubscriptionManager.getUserSubscription(userId);
    const updated: UserSubscription = {
      ...sub,
      planId,
      status: "trialing",
      trialStart: now.toISOString(),
      trialEnd: trialEnd.toISOString(),
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: trialEnd.toISOString()
    };

    return updated;
  }
}
