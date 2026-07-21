import { UserUsageRecord } from "../types";

export type UsageMetricKey = keyof Omit<UserUsageRecord, "userId" | "periodStart" | "periodEnd">;

export interface ThresholdAlertResult {
  level: "normal" | "info" | "warning" | "critical" | "exceeded";
  percentage: number;
  message: string;
}

export class UsageService {
  private static usageStore = new Map<string, UserUsageRecord>();

  public static getInitialUsage(userId: string): UserUsageRecord {
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    return {
      userId,
      aiCreditsUsed: 0,
      portfoliosCount: 0,
      storageMbUsed: 0,
      customDomainsCount: 0,
      publishingsCount: 0,
      resumesGenerated: 0,
      resumesExported: 0,
      portfoliosExported: 0,
      templatesUsedCount: 0,
      analyticsViewsCount: 0,
      apiRequestsCount: 0,
      periodStart: now.toISOString(),
      periodEnd: periodEnd.toISOString(),
    };
  }

  public static getUsage(userId: string): UserUsageRecord {
    let usage = this.usageStore.get(userId);
    if (!usage) {
      usage = this.getInitialUsage(userId);
      this.usageStore.set(userId, usage);
    } else {
      // Auto-reset check if billing period has elapsed
      if (new Date(usage.periodEnd).getTime() <= Date.now()) {
        usage = this.resetMonthlyUsage(userId, usage);
      }
    }
    return usage;
  }

  public static readUsage(userId: string): UserUsageRecord {
    return this.getUsage(userId);
  }

  public static recordUsage(
    userId: string,
    metric: UsageMetricKey,
    amount: number = 1
  ): UserUsageRecord {
    return this.incrementUsage(userId, metric, amount);
  }

  public static incrementUsage(
    userId: string,
    metric: UsageMetricKey,
    amount: number = 1
  ): UserUsageRecord {
    const usage = this.getUsage(userId);
    const currentValue = (usage[metric] as number) || 0;
    const updated = {
      ...usage,
      [metric]: currentValue + amount,
    };
    this.usageStore.set(userId, updated);
    return updated;
  }

  public static decrementUsage(
    userId: string,
    metric: UsageMetricKey,
    amount: number = 1
  ): UserUsageRecord {
    const usage = this.getUsage(userId);
    const currentValue = (usage[metric] as number) || 0;
    const updated = {
      ...usage,
      [metric]: Math.max(0, currentValue - amount),
    };
    this.usageStore.set(userId, updated);
    return updated;
  }

  public static validateLimits(
    userId: string,
    metric: UsageMetricKey,
    requestedAmount: number = 1,
    maxLimit: number = 9999
  ): { allowed: boolean; remaining: number; limit: number; current: number } {
    const usage = this.getUsage(userId);
    const current = (usage[metric] as number) || 0;
    const remaining = Math.max(0, maxLimit - current);
    const allowed = current + requestedAmount <= maxLimit;

    return {
      allowed,
      remaining,
      limit: maxLimit,
      current,
    };
  }

  public static getRemainingUsage(userId: string, metric: UsageMetricKey, maxLimit: number): number {
    const usage = this.getUsage(userId);
    const current = (usage[metric] as number) || 0;
    return Math.max(0, maxLimit - current);
  }

  public static getUsagePercentage(userId: string, metric: UsageMetricKey, maxLimit: number): number {
    const usage = this.getUsage(userId);
    const current = (usage[metric] as number) || 0;
    if (maxLimit <= 0) return 100;
    return Math.min(100, Math.round((current / maxLimit) * 100));
  }

  public static checkFeatureAvailability(userId: string, metric: UsageMetricKey, maxLimit: number): boolean {
    const usage = this.getUsage(userId);
    const current = (usage[metric] as number) || 0;
    return current < maxLimit;
  }

  public static getUsageThresholdAlert(
    userId: string,
    metric: UsageMetricKey,
    maxLimit: number
  ): ThresholdAlertResult {
    const percentage = this.getUsagePercentage(userId, metric, maxLimit);

    if (percentage >= 100) {
      return {
        level: "exceeded",
        percentage,
        message: "Quota limit reached. Upgrade plan to continue accessing this resource.",
      };
    } else if (percentage >= 90) {
      return {
        level: "critical",
        percentage,
        message: `High resource usage alert: ${percentage}% consumed. Approaching limit!`,
      };
    } else if (percentage >= 75) {
      return {
        level: "warning",
        percentage,
        message: `Resource usage notice: ${percentage}% of monthly quota consumed.`,
      };
    } else if (percentage >= 50) {
      return {
        level: "info",
        percentage,
        message: `50% capacity reached for ${String(metric)}.`,
      };
    }

    return {
      level: "normal",
      percentage,
      message: "Resource usage within standard operational parameters.",
    };
  }

  public static resetMonthlyUsage(userId: string, currentUsage?: UserUsageRecord): UserUsageRecord {
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const existing = currentUsage || this.getUsage(userId);
    const resetUsage: UserUsageRecord = {
      ...existing,
      aiCreditsUsed: 0,
      publishingsCount: 0,
      resumesGenerated: 0,
      resumesExported: 0,
      portfoliosExported: 0,
      analyticsViewsCount: 0,
      apiRequestsCount: 0,
      periodStart: now.toISOString(),
      periodEnd: periodEnd.toISOString(),
    };

    this.usageStore.set(userId, resetUsage);
    return resetUsage;
  }
}
