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
   * Verify if user can access the primary dashboard
   */
  public static canAccessDashboard(subscription: UserSubscription | null): FeatureAccessResult {
    const allowed = this.isSubscriptionOperational(subscription);
    return {
      allowed,
      reason: allowed ? undefined : "Account suspended or inactive. Please renew your subscription to access the dashboard.",
    };
  }

  /**
   * Verify if user can create / generate another portfolio
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
      reason: allowed
        ? undefined
        : `Portfolio limit reached (${currentCount}/${limit}). Upgrade your plan to generate more portfolios.`,
    };
  }

  public static canCreatePortfolio(
    subscription: UserSubscription | null,
    usage: UserUsageRecord | null
  ): FeatureAccessResult {
    return this.canGeneratePortfolio(subscription, usage);
  }

  public static canDeletePortfolio(subscription: UserSubscription | null): FeatureAccessResult {
    const allowed = this.isSubscriptionOperational(subscription);
    return { allowed };
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
      reason: allowed
        ? undefined
        : `Monthly publishing limit reached (${currentCount}/${limit}). Upgrade your plan for higher publishing quota.`,
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
    const allowed = this.isSubscriptionOperational(subscription) && currentUsed + requestedCredits <= limit;

    return {
      allowed,
      currentUsage: currentUsed,
      limit,
      reason: allowed
        ? undefined
        : `Insufficient monthly AI credits (${currentUsed}/${limit}). Upgrade your plan for additional AI credits.`,
    };
  }

  /**
   * Verify if user can use Advanced AI / High Priority Queue
   */
  public static canUseAdvancedAI(subscription: UserSubscription | null): FeatureAccessResult {
    const plan = PlanDefinitions.getPlan(subscription?.planId || "FREE");
    const allowed = this.isSubscriptionOperational(subscription) && (plan.planId === "PRO" || plan.planId === "BUSINESS");

    return {
      allowed,
      reason: allowed ? undefined : "Advanced AI features require a PRO or BUSINESS plan.",
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
      reason: allowed
        ? undefined
        : `Monthly resume export limit reached (${currentCount}/${limit}). Upgrade your plan to export more resumes.`,
    };
  }

  public static canGenerateResume(
    subscription: UserSubscription | null,
    usage: UserUsageRecord | null
  ): FeatureAccessResult {
    return this.canExportResume(subscription, usage);
  }

  /**
   * Verify if user can access premium templates
   */
  public static canUsePremiumTemplates(subscription: UserSubscription | null): FeatureAccessResult {
    const plan = PlanDefinitions.getPlan(subscription?.planId || "FREE");
    const allowed = this.isSubscriptionOperational(subscription) && plan.limits.premiumThemes;

    return {
      allowed,
      reason: allowed ? undefined : "Premium templates require a PRO or BUSINESS subscription.",
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
    const allowed =
      this.isSubscriptionOperational(subscription) && plan.limits.customDomainsCount > 0 && currentCount < limit;

    return {
      allowed,
      currentUsage: currentCount,
      limit,
      reason: allowed ? undefined : "Custom domain connection requires a PRO or BUSINESS plan.",
    };
  }

  /**
   * Verify if user can access analytics dashboard & SEO tools
   */
  public static canUseAnalytics(subscription: UserSubscription | null): FeatureAccessResult {
    const allowed = this.isSubscriptionOperational(subscription);
    return {
      allowed,
      reason: allowed ? undefined : "Analytics dashboard access requires an active plan.",
    };
  }

  public static canAccessAnalytics(subscription: UserSubscription | null): FeatureAccessResult {
    return this.canUseAnalytics(subscription);
  }

  public static canUseSEO(subscription: UserSubscription | null): FeatureAccessResult {
    const plan = PlanDefinitions.getPlan(subscription?.planId || "FREE");
    const allowed = this.isSubscriptionOperational(subscription) && (plan.planId === "PRO" || plan.planId === "BUSINESS");

    return {
      allowed,
      reason: allowed ? undefined : "Advanced SEO optimization requires a PRO or BUSINESS plan.",
    };
  }

  /**
   * Verify if user can remove watermarks / use custom branding
   */
  public static canRemoveBranding(subscription: UserSubscription | null): FeatureAccessResult {
    const plan = PlanDefinitions.getPlan(subscription?.planId || "FREE");
    const allowed = this.isSubscriptionOperational(subscription) && plan.limits.removeWatermark;

    return {
      allowed,
      reason: allowed ? undefined : "Removing BuildMyPortfolio branding requires a PRO or BUSINESS plan.",
    };
  }

  public static canUseCustomBranding(subscription: UserSubscription | null): FeatureAccessResult {
    return this.canRemoveBranding(subscription);
  }

  /**
   * Verify portfolio version history access
   */
  public static canUseVersionHistory(subscription: UserSubscription | null): FeatureAccessResult {
    const plan = PlanDefinitions.getPlan(subscription?.planId || "FREE");
    const allowed = this.isSubscriptionOperational(subscription) && (plan.planId === "PRO" || plan.planId === "BUSINESS");

    return {
      allowed,
      reason: allowed ? undefined : "Portfolio version history requires a PRO or BUSINESS plan.",
    };
  }

  /**
   * Verify template marketplace access
   */
  public static canAccessMarketplace(subscription: UserSubscription | null): FeatureAccessResult {
    const allowed = this.isSubscriptionOperational(subscription);
    return { allowed };
  }

  /**
   * Verify team workspace & collaboration access
   */
  public static canUseTeamWorkspace(subscription: UserSubscription | null): FeatureAccessResult {
    const plan = PlanDefinitions.getPlan(subscription?.planId || "FREE");
    const allowed = this.isSubscriptionOperational(subscription) && plan.limits.teamMembersCount > 1;

    return {
      allowed,
      limit: plan.limits.teamMembersCount,
      reason: allowed ? undefined : "Team workspaces require a BUSINESS subscription.",
    };
  }

  public static canUseTeamFeatures(subscription: UserSubscription | null): FeatureAccessResult {
    return this.canUseTeamWorkspace(subscription);
  }

  /**
   * Verify agency client management access
   */
  public static canManageClients(subscription: UserSubscription | null): FeatureAccessResult {
    const plan = PlanDefinitions.getPlan(subscription?.planId || "FREE");
    const allowed = this.isSubscriptionOperational(subscription) && plan.planId === "BUSINESS";

    return {
      allowed,
      reason: allowed ? undefined : "Client management & agency tools require a BUSINESS subscription.",
    };
  }
}
