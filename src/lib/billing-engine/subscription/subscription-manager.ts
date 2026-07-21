import { UserSubscription, PlanId, BillingInterval, PaymentProviderId } from "../types";
import { SubscriptionService } from "../services/subscription-service";

export class SubscriptionManager {
  public static createDefaultFreeSubscription(userId: string): UserSubscription {
    return SubscriptionService.getDefaultSubscription(userId);
  }

  public static getUserSubscription(userId: string): UserSubscription {
    return SubscriptionService.getUserSubscription(userId);
  }

  public static updateSubscription(
    userId: string,
    planId: PlanId,
    interval: BillingInterval,
    provider: PaymentProviderId,
    status: UserSubscription["status"] = "active"
  ): UserSubscription {
    return SubscriptionService.updateSubscription(userId, {
      planId,
      interval,
      provider,
      status,
    });
  }
}
