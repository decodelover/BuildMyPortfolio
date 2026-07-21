import { UserSubscription, PlanId, SubscriptionStatus, BillingInterval } from "../types";
import { BillingConfig } from "../config/billing-config";
import { PlanDefinitions } from "../plans/plan-definitions";

export class SubscriptionService {
  private static subscriptions = new Map<string, UserSubscription>();

  public static getDefaultSubscription(userId: string): UserSubscription {
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setFullYear(periodEnd.getFullYear() + 10); // Free tier effectively non-expiring

    return {
      subscriptionId: `sub_free_${userId}`,
      userId,
      planId: "FREE",
      provider: "none",
      status: "free",
      interval: "monthly",
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      cancelAtPeriodEnd: false,
    };
  }

  public static getUserSubscription(userId: string): UserSubscription {
    let sub = this.subscriptions.get(userId);
    if (!sub) {
      sub = this.getDefaultSubscription(userId);
      this.subscriptions.set(userId, sub);
    } else {
      sub = this.evaluateSubscriptionStatus(sub);
      this.subscriptions.set(userId, sub);
    }
    return sub;
  }

  public static createSubscription(params: {
    userId: string;
    planId: PlanId;
    interval?: BillingInterval;
    isTrial?: boolean;
  }): UserSubscription {
    const { userId, planId, interval = "monthly", isTrial = false } = params;
    const now = new Date();
    const periodEnd = new Date(now);

    if (interval === "yearly") {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    let status: SubscriptionStatus = planId === "FREE" ? "free" : "active";
    let trialStart: string | undefined;
    let trialEnd: string | undefined;

    if (isTrial && planId !== "FREE") {
      status = "trial";
      trialStart = now.toISOString();
      const trialEndDate = new Date(now);
      trialEndDate.setDate(trialEndDate.getDate() + BillingConfig.trialDurationDays);
      trialEnd = trialEndDate.toISOString();
    }

    const subscription: UserSubscription = {
      subscriptionId: `sub_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      userId,
      planId: PlanDefinitions.getPlan(planId).planId,
      provider: "none",
      status,
      interval,
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      cancelAtPeriodEnd: false,
      trialStart,
      trialEnd,
    };

    this.subscriptions.set(userId, subscription);
    return subscription;
  }

  public static evaluateSubscriptionStatus(sub: UserSubscription): UserSubscription {
    const nowMs = Date.now();
    const periodEndMs = new Date(sub.currentPeriodEnd).getTime();

    // Grace Period evaluation
    if (sub.status === "past_due" && sub.gracePeriodEnd) {
      if (nowMs > new Date(sub.gracePeriodEnd).getTime()) {
        return { ...sub, status: "expired" };
      }
      return { ...sub, status: "grace_period" };
    }

    // Cancellation evaluation
    if (sub.cancelAtPeriodEnd && nowMs >= periodEndMs) {
      return { ...sub, status: "expired" };
    }

    return sub;
  }

  public static updateSubscription(userId: string, updates: Partial<UserSubscription>): UserSubscription {
    const current = this.getUserSubscription(userId);
    const updated: UserSubscription = {
      ...current,
      ...updates,
    };
    this.subscriptions.set(userId, updated);
    return updated;
  }

  public static cancelSubscription(userId: string, immediately: boolean = false): UserSubscription {
    const current = this.getUserSubscription(userId);
    const now = new Date().toISOString();

    if (immediately) {
      const canceledSub: UserSubscription = {
        ...current,
        status: "expired",
        cancelAtPeriodEnd: true,
        canceledAt: now,
      };
      this.subscriptions.set(userId, canceledSub);
      return canceledSub;
    }

    const updated: UserSubscription = {
      ...current,
      status: "cancelled",
      cancelAtPeriodEnd: true,
      canceledAt: now,
    };
    this.subscriptions.set(userId, updated);
    return updated;
  }
}
