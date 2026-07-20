import { UserSubscription, PlanId, BillingInterval, PaymentProviderId } from "../types";

export class SubscriptionManager {
  private static subscriptions = new Map<string, UserSubscription>();

  public static createDefaultFreeSubscription(userId: string): UserSubscription {
    const now = new Date();
    const periodEnd = new Date(now.getTime() + 30 * 24 * 3600 * 1000);

    const sub: UserSubscription = {
      subscriptionId: `sub-free-${userId}`,
      userId,
      planId: "free",
      provider: "stripe",
      status: "active",
      interval: "monthly",
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      cancelAtPeriodEnd: false,
      customerProviderId: `cus_${userId}`,
      subscriptionProviderId: `sub_${userId}`
    };

    this.subscriptions.set(userId, sub);
    return sub;
  }

  public static getUserSubscription(userId: string): UserSubscription {
    return this.subscriptions.get(userId) || this.createDefaultFreeSubscription(userId);
  }

  public static updateSubscription(
    userId: string,
    planId: PlanId,
    interval: BillingInterval,
    provider: PaymentProviderId,
    status: UserSubscription["status"] = "active"
  ): UserSubscription {
    const current = this.getUserSubscription(userId);
    const now = new Date();
    const durationDays = interval === "yearly" ? 365 : 30;
    const periodEnd = new Date(now.getTime() + durationDays * 24 * 3600 * 1000);

    const updated: UserSubscription = {
      ...current,
      planId,
      interval,
      provider,
      status,
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      cancelAtPeriodEnd: false
    };

    this.subscriptions.set(userId, updated);
    return updated;
  }
}
