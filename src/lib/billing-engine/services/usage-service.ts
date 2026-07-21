import { UserUsageRecord } from "../types";

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
      resumesExported: 0,
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

  public static recordUsage(
    userId: string,
    metric: keyof Omit<UserUsageRecord, "userId" | "periodStart" | "periodEnd">,
    amount: number = 1
  ): UserUsageRecord {
    const usage = this.getUsage(userId);
    const updated = {
      ...usage,
      [metric]: (usage[metric] as number) + amount,
    };
    this.usageStore.set(userId, updated);
    return updated;
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
      resumesExported: 0,
      analyticsViewsCount: 0,
      apiRequestsCount: 0,
      periodStart: now.toISOString(),
      periodEnd: periodEnd.toISOString(),
    };

    this.usageStore.set(userId, resetUsage);
    return resetUsage;
  }
}
