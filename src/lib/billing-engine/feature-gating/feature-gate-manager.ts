import { UserSubscription, FeatureAccessResult, UserUsageRecord } from "../types";
import { PlanManager } from "../plans/plan-manager";

export class FeatureGateManager {
  public static canAccess(
    subscription: UserSubscription,
    featureKey: string,
    currentUsage: number = 0
  ): FeatureAccessResult {
    const plan = PlanManager.getPlan(subscription.planId);
    const limits = plan.limits;

    switch (featureKey) {
      case "ai_generations": {
        const limit = limits.aiCreditsPerMonth;
        const allowed = currentUsage < limit;
        return { allowed, currentUsage, limit, reason: allowed ? undefined : "AI generation monthly credit limit reached." };
      }
      case "portfolio_count": {
        const limit = limits.portfoliosCount;
        const allowed = currentUsage < limit;
        return { allowed, currentUsage, limit, reason: allowed ? undefined : "Maximum portfolios count reached for your current plan." };
      }
      case "custom_domains": {
        const limit = limits.customDomainsCount;
        const allowed = currentUsage < limit;
        return { allowed, currentUsage, limit, reason: allowed ? undefined : "Custom domain limit reached." };
      }
      case "publishing_count": {
        const limit = limits.publishingCountPerMonth;
        const allowed = currentUsage < limit;
        return { allowed, currentUsage, limit, reason: allowed ? undefined : "Monthly publishing count limit reached." };
      }
      case "premium_themes": {
        const allowed = limits.premiumThemes;
        return { allowed, reason: allowed ? undefined : "Premium themes require a Starter or higher plan." };
      }
      case "api_access": {
        const allowed = limits.apiAccess;
        return { allowed, reason: allowed ? undefined : "API access requires a Business or Enterprise plan." };
      }
      default:
        return { allowed: true };
    }
  }
}
