import { AdminRbacEngine, AdminRole } from "./admin-rbac-engine";

export interface SystemAuditLog {
  id: string;
  adminId: string;
  action: string;
  targetUser?: string;
  details: string;
  timestamp: string;
}

export class AdminAuditLoggerService {
  private static logs: SystemAuditLog[] = [];

  public static logAction(adminId: string, action: string, details: string, targetUser?: string) {
    const entry: SystemAuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      adminId,
      action,
      targetUser,
      details,
      timestamp: new Date().toISOString(),
    };
    this.logs.unshift(entry);
    return entry;
  }

  public static getLogs(): SystemAuditLog[] {
    return this.logs;
  }
}

export class AdminUserService {
  public static suspendUser(adminRole: AdminRole, userId: string, reason: string) {
    if (!AdminRbacEngine.canManageUsers(adminRole)) {
      throw new Error("Forbidden: Insufficient privileges to suspend user account.");
    }
    AdminAuditLoggerService.logAction("admin", "SUSPEND_USER", `Reason: ${reason}`, userId);
    return { success: true, userId, status: "suspended" };
  }

  public static reactivateUser(adminRole: AdminRole, userId: string) {
    if (!AdminRbacEngine.canManageUsers(adminRole)) {
      throw new Error("Forbidden: Insufficient privileges to reactivate user account.");
    }
    AdminAuditLoggerService.logAction("admin", "REACTIVATE_USER", "Reactivated user account", userId);
    return { success: true, userId, status: "active" };
  }
}

export class AdminSubscriptionService {
  public static overrideUserPlan(adminRole: AdminRole, userId: string, newPlanId: "FREE" | "PRO" | "BUSINESS") {
    if (!AdminRbacEngine.canManageSubscriptions(adminRole)) {
      throw new Error("Forbidden: Insufficient privileges to override subscription plan.");
    }
    AdminAuditLoggerService.logAction("admin", "OVERRIDE_SUBSCRIPTION", `Set plan to ${newPlanId}`, userId);
    return { success: true, userId, planId: newPlanId };
  }
}

export class AdminSystemSettingsService {
  private static maintenanceMode: boolean = false;

  public static toggleMaintenanceMode(adminRole: AdminRole, enabled: boolean) {
    if (!AdminRbacEngine.canManageSystemSettings(adminRole)) {
      throw new Error("Forbidden: Insufficient privileges to change system settings.");
    }
    this.maintenanceMode = enabled;
    AdminAuditLoggerService.logAction("admin", "TOGGLE_MAINTENANCE", `Maintenance mode set to ${enabled}`);
    return { maintenanceMode: this.maintenanceMode };
  }

  public static isMaintenanceMode(): boolean {
    return this.maintenanceMode;
  }
}
