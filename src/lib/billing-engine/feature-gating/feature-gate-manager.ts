import { UserSubscription, FeatureAccessResult } from "../types";
import { PermissionService } from "../services/permission-service";

export class FeatureGateManager {
  public static canAccess(
    subscription: UserSubscription,
    featureKey: string,
    _currentUsage: number = 0
  ): FeatureAccessResult {
    switch (featureKey) {
      case "ai_generations":
      case "use_ai":
        return PermissionService.canUseAI(subscription, null);
      case "portfolio_count":
      case "generate_portfolio":
        return PermissionService.canGeneratePortfolio(subscription, null);
      case "custom_domains":
      case "connect_domain":
        return PermissionService.canConnectDomain(subscription, null);
      case "publishing_count":
      case "publish_portfolio":
        return PermissionService.canPublishPortfolio(subscription, null);
      case "export_resume":
        return PermissionService.canExportResume(subscription, null);
      case "premium_themes":
      case "premium_templates":
        return PermissionService.canUsePremiumTemplates(subscription);
      case "analytics":
        return PermissionService.canAccessAnalytics(subscription);
      case "custom_branding":
        return PermissionService.canUseCustomBranding(subscription);
      case "team_features":
        return PermissionService.canUseTeamFeatures(subscription);
      default:
        return { allowed: true };
    }
  }
}
