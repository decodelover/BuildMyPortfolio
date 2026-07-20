import { UserUsageRecord } from "../types";

export class UsageTracker {
  private static userUsage = new Map<string, UserUsageRecord>();

  public static getUsage(userId: string): UserUsageRecord {
    const existing = this.userUsage.get(userId);
    if (existing) return existing;

    const newRecord: UserUsageRecord = {
      userId,
      aiCreditsUsed: 0,
      portfoliosCount: 0,
      storageMbUsed: 0,
      customDomainsCount: 0,
      publishingsCount: 0,
      periodStart: new Date().toISOString()
    };

    this.userUsage.set(userId, newRecord);
    return newRecord;
  }

  public static incrementUsage(userId: string, metric: keyof Omit<UserUsageRecord, "userId" | "periodStart">, amount: number = 1): UserUsageRecord {
    const record = this.getUsage(userId);
    (record[metric] as number) += amount;
    this.userUsage.set(userId, record);
    return record;
  }

  public static resetUsagePeriod(userId: string): UserUsageRecord {
    const record = this.getUsage(userId);
    record.aiCreditsUsed = 0;
    record.publishingsCount = 0;
    record.periodStart = new Date().toISOString();
    this.userUsage.set(userId, record);
    return record;
  }
}
