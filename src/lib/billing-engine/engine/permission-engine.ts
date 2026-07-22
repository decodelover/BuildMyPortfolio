import { SubscriptionService } from "../services/subscription-service";
import { UsageService } from "../services/usage-service";
import { PermissionService } from "../services/permission-service";
import { FeatureAccessResult } from "../types";

export class PermissionEngine {
  public static checkPermission(userId: string, permissionKey: string): FeatureAccessResult {
    const subscription = SubscriptionService.getUserSubscription(userId);
    const usage = UsageService.getUsage(userId);

    switch (permissionKey) {
      case "access_dashboard":
        return PermissionService.canAccessDashboard(subscription);
      case "access_billing":
        return PermissionService.canAccessBilling(subscription);
      case "generate_portfolio":
      case "create_portfolio":
        return PermissionService.canGeneratePortfolio(subscription, usage);
      case "publish_portfolio":
        return PermissionService.canPublishPortfolio(subscription, usage);
      case "delete_portfolio":
        return PermissionService.canDeletePortfolio(subscription);
      case "use_ai":
      case "generate_ai":
        return PermissionService.canUseAI(subscription, usage);
      case "generate_resume":
      case "export_resume":
        return PermissionService.canExportResume(subscription, usage);
      case "premium_templates":
      case "use_premium_templates":
        return PermissionService.canUsePremiumTemplates(subscription);
      case "use_analytics":
      case "access_analytics":
        return PermissionService.canUseAnalytics(subscription);
      case "access_marketplace":
        return PermissionService.canAccessMarketplace(subscription);
      case "connect_domain":
      case "custom_domains":
        return PermissionService.canConnectDomain(subscription, usage);
      case "use_seo":
        return PermissionService.canUseSEO(subscription);
      case "team_workspace":
      case "use_team_features":
        return PermissionService.canUseTeamWorkspace(subscription);
      case "manage_clients":
        return PermissionService.canManageClients(subscription);
      case "use_whitelabel":
        return PermissionService.canUseWhiteLabel(subscription);
      default:
        return { allowed: true };
    }
  }

  public static canAccessAdmin(role?: string): FeatureAccessResult {
    return PermissionService.canAccessAdmin(role);
  }
}
