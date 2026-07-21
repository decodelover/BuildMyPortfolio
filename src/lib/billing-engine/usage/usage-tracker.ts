import { UserUsageRecord } from "../types";
import { UsageService } from "../services/usage-service";

export class UsageTracker {
  public static getUsage(userId: string): UserUsageRecord {
    return UsageService.getUsage(userId);
  }

  public static incrementUsage(
    userId: string,
    metric: keyof Omit<UserUsageRecord, "userId" | "periodStart" | "periodEnd">,
    amount: number = 1
  ): UserUsageRecord {
    return UsageService.recordUsage(userId, metric, amount);
  }

  public static resetUsagePeriod(userId: string): UserUsageRecord {
    return UsageService.resetMonthlyUsage(userId);
  }
}
