import { UserSubscription } from "../types";
import { SubscriptionManager } from "./subscription-manager";

export class CancellationManager {
  public static cancelSubscription(userId: string, immediately: boolean = false): UserSubscription {
    const sub = SubscriptionManager.getUserSubscription(userId);

    if (immediately) {
      return SubscriptionManager.updateSubscription(userId, "free", "monthly", sub.provider, "canceled");
    }

    const updated: UserSubscription = {
      ...sub,
      cancelAtPeriodEnd: true,
      canceledAt: new Date().toISOString()
    };

    return updated;
  }
}
