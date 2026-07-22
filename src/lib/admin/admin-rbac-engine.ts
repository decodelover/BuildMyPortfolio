export type AdminRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "SUPPORT_AGENT"
  | "FINANCE_MANAGER"
  | "CONTENT_MANAGER"
  | "DEVELOPER";

export type AdminPermission =
  | "manage_users"
  | "manage_subscriptions"
  | "view_financials"
  | "manage_support"
  | "manage_content"
  | "manage_system_settings"
  | "view_audit_logs";

const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  SUPER_ADMIN: [
    "manage_users",
    "manage_subscriptions",
    "view_financials",
    "manage_support",
    "manage_content",
    "manage_system_settings",
    "view_audit_logs",
  ],
  ADMIN: [
    "manage_users",
    "manage_subscriptions",
    "view_financials",
    "manage_support",
    "manage_content",
    "view_audit_logs",
  ],
  SUPPORT_AGENT: ["manage_support", "manage_users"],
  FINANCE_MANAGER: ["view_financials", "manage_subscriptions", "view_audit_logs"],
  CONTENT_MANAGER: ["manage_content"],
  DEVELOPER: ["manage_system_settings", "view_audit_logs"],
};

export class AdminRbacEngine {
  public static hasPermission(role: AdminRole | string = "ADMIN", permission: AdminPermission): boolean {
    const normalizedRole = (role || "").toUpperCase() as AdminRole;
    const permissions = ROLE_PERMISSIONS[normalizedRole] || ROLE_PERMISSIONS.ADMIN;
    return permissions.includes(permission);
  }

  public static canManageUsers(role?: string): boolean {
    return this.hasPermission(role, "manage_users");
  }

  public static canManageSubscriptions(role?: string): boolean {
    return this.hasPermission(role, "manage_subscriptions");
  }

  public static canViewFinancials(role?: string): boolean {
    return this.hasPermission(role, "view_financials");
  }

  public static canManageSupport(role?: string): boolean {
    return this.hasPermission(role, "manage_support");
  }

  public static canManageContent(role?: string): boolean {
    return this.hasPermission(role, "manage_content");
  }

  public static canManageSystemSettings(role?: string): boolean {
    return this.hasPermission(role, "manage_system_settings");
  }

  public static canViewAuditLogs(role?: string): boolean {
    return this.hasPermission(role, "view_audit_logs");
  }
}
