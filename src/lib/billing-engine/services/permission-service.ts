import { UserSubscription, UserUsageRecord, FeatureAccessResult } from "../types";
import { PlanDefinitions } from "../plans/plan-definitions";

export class PermissionService {
  /**
   * Check if subscription status is active or within allowed operational state
   */
  public static isSubscriptionOperational(subscription: UserSubscription | null): boolean {
    if (!subscription) return true; // Default free tier fallback
    const validStates = ["free", "trial", "active", "grace_period", "canceled", "trialing"];
    return validStates.includes(subscription.status);
  }

  /**
   * Verify if user can generate another portfolio
   */
  public static canGeneratePortfolio(
    subscription: UserSubscription | null,
    usage: UserUsageRecord | null
  ): FeatureAccessResult {
    const plan = PlanDefinitions.getPlan(subscription?.planId || "FREE");
    const currentCount = usage?.portfoliosCount || 0;
    const limit = plan.limits.portfoliosCount;
    const allowed = this.isSubscriptionOperational(subscription) && currentCount < limit;

    return {
      allowed,
      currentUsage: currentCount,
      limit,
      reason: allowed ? undefined : `Portfolio limit reached (${currentCount}/${limit}). Upgrade your plan to generate more portfolios.`,
    };
  }

  /**
   * Verify if user can publish a portfolio
   */
  public static canPublishPortfolio(
    subscription: UserSubscription | null,
    usage: UserUsageRecord | null
  ): FeatureAccessResult {
    const plan = PlanDefinitions.getPlan(subscription?.planId || "FREE");
    const currentCount = usage?.publishingsCount || 0;
    const limit = plan.limits.publishingCountPerMonth;
    const allowed = this.isSubscriptionOperational(subscription) && currentCount < limit;

    return {
      allowed,
      currentUsage: currentCount,
      limit,
      reason: allowed ? undefined : `Monthly publishing limit reached (${currentCount}/${limit}). Upgrade your plan for higher publishing quota.`,
    };
  }

  /**
   * Verify if user can use AI generation credits
   */
  public static canUseAI(
    subscription: UserSubscription | null,
    usage: UserUsageRecord | null,
    requestedCredits: number = 1
  ): FeatureAccessResult {
    const plan = PlanDefinitions.getPlan(subscription?.planId || "FREE");
    const currentUsed = usage?.aiCreditsUsed || 0;
    const limit = plan.limits.aiCreditsPerMonth;
    const allowed = this.isSubscriptionOperational(subscription) && (currentUsed + requestedCredits <= limit);

    return {
      allowed,
      currentUsage: currentUsed,
      limit,
      reason: allowed ? undefined : `Insufficient monthly AI credits (${currentUsed}/${limit}). Upgrade your plan for additional AI credits.`,
    };
  }

  /**
   * Verify if user can export a resume
   */
  public static canExportResume(
    subscription: UserSubscription | null,
    usage: UserUsageRecord | null
  ): FeatureAccessResult {
    const plan = PlanDefinitions.getPlan(subscription?.planId || "FREE");
    const currentCount = usage?.resumesExported || 0;
    const limit = plan.limits.resumeExportsPerMonth;
    const allowed = this.isSubscriptionOperational(subscription) && currentCount < limit;

    return {
      allowed,
      currentUsage: currentCount,
      limit,
      reason: allowed ? undefined : `Monthly resume export limit reached (${currentCount}/${limit}). Upgrade your plan to export more resumes.`,
    };
  }

  /**
   * Verify if user can access premium themes
   */
  public static canUsePremiumTemplates(subscription: UserSubscription | null): FeatureAccessResult {
    const plan = PlanDefinitions.getPlan(subscription?.planId || "FREE");
    const allowed = this.isSubscriptionOperational(subscription) && plan.limits.premiumThemes;

    return {
      allowed,
      reason: allowed ? undefined : "Premium themes require a PRO or BUSINESS subscription.",
    };
  }

  /**
   * Verify if user can connect a custom domain
   */
  public static canConnectDomain(
    subscription: UserSubscription | null,
    usage: UserUsageRecord | null
  ): FeatureAccessResult {
    const plan = PlanDefinitions.getPlan(subscription?.planId || "FREE");
    const currentCount = usage?.customDomainsCount || 0;
    const limit = plan.limits.customDomainsCount;
    const allowed = this.isSubscriptionOperational(subscription) && plan.limits.customDomainsCount > 0 && currentCount < limit;

    return {
      allowed,
      currentUsage: currentCount,
      limit,
      reason: allowed ? undefined : "Custom domain connection requires a PRO or BUSINESS plan.",
    };
  }

  /**
   * Verify if user can access analytics dashboard
   */
  public static canAccessAnalytics(subscription: UserSubscription | null): FeatureAccessResult {
    const _plan = PlanDefinitions.getPlan(subscription?.planId || "FREE");
    const allowed = this.isSubscriptionOperational(subscription);

    return {
      allowed,
      reason: allowed ? undefined : "Analytics dashboard access requires an active plan.",
    };
  }

  /**
   * Verify if user can remove watermarks / use custom branding
   */
  public static canUseCustomBranding(subscription: UserSubscription | null): FeatureAccessResult {
    const plan = PlanDefinitions.getPlan(subscription?.planId || "FREE");
    const allowed = this.isSubscriptionOperational(subscription) && plan.limits.customBranding;

    return {
      allowed,
      reason: allowed ? undefined : "Custom whitelabel branding requires a BUSINESS subscription.",
    };
  }

  /**
   * Verify if user can use team collaboration features
   */
  public static canUseTeamFeatures(subscription: UserSubscription | null): FeatureAccessResult {
    const plan = PlanDefinitions.getPlan(subscription?.planId || "FREE");
    const allowed = this.isSubscriptionOperational(subscription) && plan.limits.teamMembersCount > 1;

    return {
      allowed,
      limit: plan.limits.teamMembersCount,
      reason: allowed ? undefined : "Team collaboration features require a BUSINESS subscription.",
    };
  }
}
