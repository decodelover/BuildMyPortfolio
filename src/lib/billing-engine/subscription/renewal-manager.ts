import { UserSubscription } from "../types";
import { SubscriptionManager } from "./subscription-manager";

export class RenewalManager {
  public static processRenewal(userId: string): UserSubscription {
    const sub = SubscriptionManager.getUserSubscription(userId);
    return SubscriptionManager.updateSubscription(userId, sub.planId, sub.interval, sub.provider, "active");
  }

  public static handleFailedPayment(userId: string): UserSubscription {
    const sub = SubscriptionManager.getUserSubscription(userId);
    const updated: UserSubscription = {
      ...sub,
      status: "past_due"
    };
    return updated;
  }
}
