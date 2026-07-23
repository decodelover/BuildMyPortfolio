export type AdminRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "SUPPORT_AGENT"
  | "FINANCE_MANAGER"
  | "CONTENT_MANAGER"
  | "DEVELOPER"
  | "USER"
  | "PRO_USER"
  | "BUSINESS_USER";

export type AdminPermission =
  | "manage_users"
  | "edit_user_profiles"
  | "delete_users"
  | "impersonate_users"
  | "manage_roles"
  | "bulk_user_operations"
  | "manage_subscriptions"
  | "view_financials"
  | "manage_support"
  | "manage_content"
  | "manage_system_settings"
  | "view_audit_logs";

const ROLE_PERMISSIONS: Record<string, AdminPermission[]> = {
  SUPER_ADMIN: [
    "manage_users",
    "edit_user_profiles",
    "delete_users",
    "impersonate_users",
    "manage_roles",
    "bulk_user_operations",
    "manage_subscriptions",
    "view_financials",
    "manage_support",
    "manage_content",
    "manage_system_settings",
    "view_audit_logs",
  ],
  ADMIN: [
    "manage_users",
    "edit_user_profiles",
    "bulk_user_operations",
    "manage_subscriptions",
    "view_financials",
    "manage_support",
    "manage_content",
    "view_audit_logs",
  ],
  SUPPORT_AGENT: [
    "manage_support",
    "manage_users",
    "edit_user_profiles",
  ],
  FINANCE_MANAGER: [
    "view_financials",
    "manage_subscriptions",
    "view_audit_logs",
  ],
  CONTENT_MANAGER: [
    "manage_content",
  ],
  DEVELOPER: [
    "manage_system_settings",
    "view_audit_logs",
  ],
  USER: [],
  PRO_USER: [],
  BUSINESS_USER: [],
};

export class AdminRbacEngine {
  public static hasPermission(role: string = "ADMIN", permission: AdminPermission): boolean {
    const normalizedRole = (role || "").toUpperCase();
    const permissions = ROLE_PERMISSIONS[normalizedRole] || [];
    return permissions.includes(permission);
  }

  public static canManageUsers(role?: string): boolean {
    return this.hasPermission(role, "manage_users");
  }

  public static canEditUserProfiles(role?: string): boolean {
    return this.hasPermission(role, "edit_user_profiles");
  }

  public static canDeleteUsers(role?: string): boolean {
    return this.hasPermission(role, "delete_users");
  }

  public static canImpersonateUsers(role?: string): boolean {
    return this.hasPermission(role, "impersonate_users");
  }

  public static canManageRoles(role?: string): boolean {
    return this.hasPermission(role, "manage_roles");
  }

  public static canPerformBulkOperations(role?: string): boolean {
    return this.hasPermission(role, "bulk_user_operations");
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
