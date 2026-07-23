import { AdminRbacEngine } from "./admin-rbac-engine";
import {
  EnterpriseUser,
  UserDirectoryQuery,
  UserDirectoryResult,
  AdminAuditLogEntry,
  EnterpriseRole,
  SubscriptionPlanType,
  UserAccountStatus,
} from "@/types/admin-user";

// Seed dataset for enterprise user directory
const MOCK_USERS_SEED: EnterpriseUser[] = [
  {
    id: "usr_101",
    name: "Alex Morgan",
    username: "alexmorgan",
    email: "alex.morgan@example.com",
    phoneNumber: "+1 (555) 234-5678",
    photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    country: "United States",
    timezone: "America/New_York",
    registrationDate: "2026-01-15T08:30:00Z",
    lastLogin: "2026-07-22T14:45:00Z",
    loginProvider: "google",
    role: "PRO_USER",
    status: "active",
    emailVerified: true,
    subscriptionPlan: "PRO",
    subscriptionStatus: "active",
    portfolioCount: 4,
    publishedPortfolioCount: 3,
    resumeCount: 2,
    storageUsageBytes: 450 * 1024 * 1024, // 450 MB
    aiUsageCredits: 1850,
    paymentHistorySummary: [
      { id: "inv_901", amount: 29.0, currency: "USD", status: "paid", date: "2026-07-01", description: "Pro Monthly Subscription", invoiceUrl: "#" },
      { id: "inv_850", amount: 29.0, currency: "USD", status: "paid", date: "2026-06-01", description: "Pro Monthly Subscription", invoiceUrl: "#" },
    ],
    supportHistory: [
      { id: "tkt_12", subject: "Custom domain SSL issue", status: "resolved", priority: "medium", date: "2026-06-18" },
    ],
    recentActivity: [
      { id: "act_1", action: "PUBLISH_PORTFOLIO", description: "Published modern-dev-portfolio v2", timestamp: "2026-07-22T14:40:00Z", ipAddress: "192.168.1.1" },
      { id: "act_2", action: "AI_GENERATION", description: "Generated AI resume summary", timestamp: "2026-07-20T11:15:00Z", ipAddress: "192.168.1.1" },
    ],
  },
  {
    id: "usr_102",
    name: "Sarah Chen",
    username: "sarahchen",
    email: "sarah.c@techsolutions.io",
    phoneNumber: "+1 (555) 987-6543",
    photoURL: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    country: "Canada",
    timezone: "America/Toronto",
    registrationDate: "2025-11-20T10:12:00Z",
    lastLogin: "2026-07-23T01:20:00Z",
    loginProvider: "email",
    role: "BUSINESS_USER",
    status: "active",
    emailVerified: true,
    subscriptionPlan: "BUSINESS",
    subscriptionStatus: "active",
    portfolioCount: 12,
    publishedPortfolioCount: 10,
    resumeCount: 6,
    storageUsageBytes: 3.2 * 1024 * 1024 * 1024, // 3.2 GB
    aiUsageCredits: 9400,
    paymentHistorySummary: [
      { id: "inv_902", amount: 99.0, currency: "USD", status: "paid", date: "2026-07-05", description: "Business Plan Subscription", invoiceUrl: "#" },
      { id: "inv_855", amount: 99.0, currency: "USD", status: "paid", date: "2026-06-05", description: "Business Plan Subscription", invoiceUrl: "#" },
    ],
    supportHistory: [
      { id: "tkt_18", subject: "Team member seats request", status: "open", priority: "high", date: "2026-07-21" },
    ],
    recentActivity: [
      { id: "act_3", action: "UPDATE_PROFILE", description: "Updated organization timezone and branding", timestamp: "2026-07-23T01:15:00Z", ipAddress: "24.114.50.12" },
    ],
  },
  {
    id: "usr_103",
    name: "David Kim",
    username: "dkim_dev",
    email: "david.kim@gmail.com",
    phoneNumber: "+82 10-1234-5678",
    country: "South Korea",
    timezone: "Asia/Seoul",
    registrationDate: "2026-07-01T04:15:00Z",
    lastLogin: "2026-07-15T09:00:00Z",
    loginProvider: "github",
    role: "USER",
    status: "active",
    emailVerified: true,
    subscriptionPlan: "FREE",
    subscriptionStatus: "none",
    portfolioCount: 1,
    publishedPortfolioCount: 1,
    resumeCount: 1,
    storageUsageBytes: 45 * 1024 * 1024,
    aiUsageCredits: 120,
    paymentHistorySummary: [],
    supportHistory: [],
    recentActivity: [
      { id: "act_4", action: "CREATE_PORTFOLIO", description: "Created Minimalist Portfolio", timestamp: "2026-07-01T04:20:00Z", ipAddress: "211.200.12.4" },
    ],
  },
  {
    id: "usr_104",
    name: "Elena Rostova",
    username: "elena_r",
    email: "elena.rostova@designstudio.de",
    phoneNumber: "+49 30 123456",
    photoURL: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    country: "Germany",
    timezone: "Europe/Berlin",
    registrationDate: "2026-05-14T15:22:00Z",
    lastLogin: "2026-07-10T12:00:00Z",
    loginProvider: "email",
    role: "PRO_USER",
    status: "suspended",
    emailVerified: true,
    subscriptionPlan: "PRO",
    subscriptionStatus: "past_due",
    portfolioCount: 3,
    publishedPortfolioCount: 0,
    resumeCount: 2,
    storageUsageBytes: 680 * 1024 * 1024,
    aiUsageCredits: 0,
    suspensionReason: "Suspicious API automation burst & Terms of Service inquiry",
    suspensionEndDate: "2026-08-01T00:00:00Z",
    paymentHistorySummary: [
      { id: "inv_890", amount: 29.0, currency: "USD", status: "failed", date: "2026-07-14", description: "Pro Monthly Subscription", invoiceUrl: "#" },
    ],
    supportHistory: [
      { id: "tkt_09", subject: "Account suspension appeal", status: "in_progress", priority: "urgent", date: "2026-07-16" },
    ],
    recentActivity: [
      { id: "act_5", action: "ACCOUNT_SUSPENDED", description: "Account suspended by Admin", timestamp: "2026-07-15T10:00:00Z", ipAddress: "85.214.132.11" },
    ],
  },
  {
    id: "usr_105",
    name: "Marcus Vance",
    username: "marcus_enterprise",
    email: "marcus.vance@globalcorp.com",
    phoneNumber: "+44 20 7946 0912",
    photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    country: "United Kingdom",
    timezone: "Europe/London",
    registrationDate: "2025-08-10T11:00:00Z",
    lastLogin: "2026-07-23T02:10:00Z",
    loginProvider: "saml",
    role: "SUPER_ADMIN",
    status: "active",
    emailVerified: true,
    subscriptionPlan: "ENTERPRISE",
    subscriptionStatus: "active",
    portfolioCount: 25,
    publishedPortfolioCount: 22,
    resumeCount: 15,
    storageUsageBytes: 15.4 * 1024 * 1024 * 1024,
    aiUsageCredits: 50000,
    paymentHistorySummary: [
      { id: "inv_999", amount: 499.0, currency: "USD", status: "paid", date: "2026-07-01", description: "Enterprise Platform License", invoiceUrl: "#" },
    ],
    supportHistory: [],
    recentActivity: [
      { id: "act_6", action: "ADMIN_LOGIN", description: "Logged into Admin Console", timestamp: "2026-07-23T02:10:00Z", ipAddress: "81.2.69.142" },
    ],
  },
  {
    id: "usr_106",
    name: "Priya Sharma",
    username: "psharma_tech",
    email: "priya.sharma@innovate.in",
    phoneNumber: "+91 98765 43210",
    country: "India",
    timezone: "Asia/Kolkata",
    registrationDate: "2026-03-22T09:40:00Z",
    lastLogin: "2026-07-21T18:30:00Z",
    loginProvider: "google",
    role: "SUPPORT_AGENT",
    status: "active",
    emailVerified: true,
    subscriptionPlan: "BUSINESS",
    subscriptionStatus: "active",
    portfolioCount: 2,
    publishedPortfolioCount: 2,
    resumeCount: 1,
    storageUsageBytes: 120 * 1024 * 1024,
    aiUsageCredits: 4200,
    paymentHistorySummary: [],
    supportHistory: [],
    recentActivity: [
      { id: "act_7", action: "RESOLVE_TICKET", description: "Resolved support ticket #tkt_12", timestamp: "2026-07-21T18:25:00Z", ipAddress: "103.21.124.5" },
    ],
  },
  {
    id: "usr_107",
    name: "Lucas Silva",
    username: "lucas_silva",
    email: "lucas.silva@designdao.br",
    phoneNumber: "+55 11 91234-5678",
    country: "Brazil",
    timezone: "America/Sao_Paulo",
    registrationDate: "2026-06-19T14:10:00Z",
    lastLogin: "2026-06-20T10:00:00Z",
    loginProvider: "email",
    role: "USER",
    status: "disabled",
    emailVerified: false,
    subscriptionPlan: "FREE",
    subscriptionStatus: "none",
    portfolioCount: 0,
    publishedPortfolioCount: 0,
    resumeCount: 0,
    storageUsageBytes: 0,
    aiUsageCredits: 0,
    paymentHistorySummary: [],
    supportHistory: [],
    recentActivity: [
      { id: "act_8", action: "ACCOUNT_REGISTER", description: "Registered account", timestamp: "2026-06-19T14:10:00Z", ipAddress: "177.18.90.2" },
    ],
  },
  {
    id: "usr_108",
    name: "Amara Okezie",
    username: "amara_o",
    email: "amara.okezie@fintech.ng",
    phoneNumber: "+234 803 123 4567",
    country: "Nigeria",
    timezone: "Africa/Lagos",
    registrationDate: "2026-04-05T12:00:00Z",
    lastLogin: "2026-07-22T20:15:00Z",
    loginProvider: "github",
    role: "FINANCE_MANAGER",
    status: "active",
    emailVerified: true,
    subscriptionPlan: "PRO",
    subscriptionStatus: "active",
    portfolioCount: 5,
    publishedPortfolioCount: 4,
    resumeCount: 3,
    storageUsageBytes: 780 * 1024 * 1024,
    aiUsageCredits: 3100,
    paymentHistorySummary: [
      { id: "inv_910", amount: 29.0, currency: "USD", status: "paid", date: "2026-07-04", description: "Pro Subscription", invoiceUrl: "#" },
    ],
    supportHistory: [],
    recentActivity: [
      { id: "act_9", action: "EXPORT_REPORT", description: "Exported monthly billing report", timestamp: "2026-07-22T20:10:00Z", ipAddress: "102.89.2.11" },
    ],
  },
];

export class AdminUserService {
  private static usersStore: EnterpriseUser[] = [...MOCK_USERS_SEED];
  private static auditLogsStore: AdminAuditLogEntry[] = [
    {
      id: "log_seed_1",
      adminId: "usr_105",
      adminEmail: "marcus.vance@globalcorp.com",
      adminRole: "SUPER_ADMIN",
      action: "SUSPEND_USER",
      targetUserId: "usr_104",
      targetUserEmail: "elena.rostova@designstudio.de",
      previousValue: "active",
      newValue: "suspended",
      details: "Suspended account due to API rate anomaly inspection.",
      timestamp: "2026-07-15T10:00:00Z",
      ipAddress: "81.2.69.142",
    },
  ];

  // Helper to append audit logs
  public static logAudit(
    adminRole: string,
    adminId: string,
    action: string,
    details: string,
    targetUserId?: string,
    targetUserEmail?: string,
    previousValue?: any,
    newValue?: any,
    ipAddress: string = "127.0.0.1"
  ): AdminAuditLogEntry {
    const entry: AdminAuditLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      adminId: adminId || "admin_system",
      adminEmail: adminId === "usr_105" ? "marcus.vance@globalcorp.com" : "admin@buildmyportfolio.com",
      adminRole: adminRole || "ADMIN",
      action,
      targetUserId,
      targetUserEmail,
      previousValue,
      newValue,
      details,
      timestamp: new Date().toISOString(),
      ipAddress,
    };
    this.auditLogsStore.unshift(entry);
    return entry;
  }

  // Get directory users with filtering, sorting & pagination
  public static async getUsers(query: UserDirectoryQuery): Promise<UserDirectoryResult> {
    let filtered = [...this.usersStore];

    // Search filter across name, email, username, phone, and ID
    if (query.search && query.search.trim()) {
      const q = query.search.toLowerCase().trim();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q) ||
          (u.phoneNumber && u.phoneNumber.toLowerCase().includes(q))
      );
    }

    // Role filter
    if (query.role && query.role !== "ALL") {
      filtered = filtered.filter((u) => u.role.toUpperCase() === query.role?.toUpperCase());
    }

    // Plan filter
    if (query.plan && query.plan !== "ALL") {
      filtered = filtered.filter((u) => u.subscriptionPlan.toUpperCase() === query.plan?.toUpperCase());
    }

    // Status filter
    if (query.status && query.status !== "ALL") {
      filtered = filtered.filter((u) => u.status.toLowerCase() === query.status?.toLowerCase());
    }

    // Country filter
    if (query.country && query.country !== "ALL") {
      filtered = filtered.filter((u) => u.country.toLowerCase() === query.country?.toLowerCase());
    }

    // Auth Provider filter
    if (query.authProvider && query.authProvider !== "ALL") {
      filtered = filtered.filter((u) => u.loginProvider.toLowerCase() === query.authProvider?.toLowerCase());
    }

    // Activity filter
    if (query.activity && query.activity !== "ALL") {
      if (query.activity === "high") {
        filtered = filtered.filter((u) => u.aiUsageCredits > 2000 || u.portfolioCount >= 3);
      } else if (query.activity === "low") {
        filtered = filtered.filter((u) => u.aiUsageCredits <= 500 && u.portfolioCount <= 1);
      } else if (query.activity === "inactive") {
        filtered = filtered.filter((u) => u.portfolioCount === 0 || u.status === "disabled");
      }
    }

    // Date Range Filters
    const now = new Date().getTime();
    if (query.regDateRange && query.regDateRange !== "all") {
      filtered = filtered.filter((u) => {
        const regTime = new Date(u.registrationDate).getTime();
        const diffHours = (now - regTime) / (1000 * 60 * 60);
        if (query.regDateRange === "24h") return diffHours <= 24;
        if (query.regDateRange === "7d") return diffHours <= 24 * 7;
        if (query.regDateRange === "30d") return diffHours <= 24 * 30;
        return true;
      });
    }

    if (query.lastLoginRange && query.lastLoginRange !== "all") {
      filtered = filtered.filter((u) => {
        const loginTime = new Date(u.lastLogin).getTime();
        const diffDays = (now - loginTime) / (1000 * 60 * 60 * 24);
        if (query.lastLoginRange === "7d") return diffDays <= 7;
        if (query.lastLoginRange === "30d") return diffDays <= 30;
        if (query.lastLoginRange === "inactive30") return diffDays > 30;
        if (query.lastLoginRange === "never") return u.lastLogin === u.registrationDate;
        return true;
      });
    }

    // Sorting
    const sortBy = query.sortBy || "registrationDate";
    const sortOrder = query.sortOrder || "desc";

    filtered.sort((a, b) => {
      let valA: any = a[sortBy as keyof EnterpriseUser] ?? "";
      let valB: any = b[sortBy as keyof EnterpriseUser] ?? "";

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    // Pagination
    const total = filtered.length;
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, query.limit || 10);
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedUsers = filtered.slice(startIndex, startIndex + limit);

    // Compute Stats
    const stats = {
      totalUsers: this.usersStore.length,
      activeUsers: this.usersStore.filter((u) => u.status === "active").length,
      suspendedUsers: this.usersStore.filter((u) => u.status === "suspended").length,
      proUsers: this.usersStore.filter((u) => u.subscriptionPlan === "PRO").length,
      businessUsers: this.usersStore.filter((u) => u.subscriptionPlan === "BUSINESS").length,
      enterpriseUsers: this.usersStore.filter((u) => u.subscriptionPlan === "ENTERPRISE").length,
    };

    return {
      users: paginatedUsers,
      total,
      page,
      limit,
      totalPages,
      stats,
    };
  }

  // Get User Profile by ID
  public static async getUserById(userId: string): Promise<EnterpriseUser | null> {
    const user = this.usersStore.find((u) => u.id === userId);
    return user ? { ...user } : null;
  }

  // Edit User Profile
  public static async updateUserProfile(
    adminRole: string,
    adminId: string,
    userId: string,
    updateData: Partial<EnterpriseUser>,
    ipAddress?: string
  ): Promise<EnterpriseUser> {
    if (!AdminRbacEngine.canEditUserProfiles(adminRole)) {
      throw new Error("Forbidden: Insufficient permissions to edit user profile.");
    }

    const index = this.usersStore.findIndex((u) => u.id === userId);
    if (index === -1) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    const targetUser = this.usersStore[index];

    // Protection against privilege escalation
    if (updateData.role && updateData.role === "SUPER_ADMIN" && adminRole !== "SUPER_ADMIN") {
      throw new Error("Forbidden: Only Super Admins can assign the SUPER_ADMIN role.");
    }

    const previousValue = { ...targetUser };
    const updatedUser: EnterpriseUser = {
      ...targetUser,
      ...updateData,
    };

    this.usersStore[index] = updatedUser;

    this.logAudit(
      adminRole,
      adminId,
      "UPDATE_USER_PROFILE",
      `Updated user profile fields for ${targetUser.name}`,
      userId,
      targetUser.email,
      previousValue,
      updatedUser,
      ipAddress
    );

    return { ...updatedUser };
  }

  // Suspend User
  public static async suspendUser(
    adminRole: string,
    adminId: string,
    userId: string,
    reason: string,
    durationDays?: number,
    ipAddress?: string
  ): Promise<{ success: boolean; user: EnterpriseUser }> {
    if (!AdminRbacEngine.canManageUsers(adminRole)) {
      throw new Error("Forbidden: Insufficient privileges to suspend user account.");
    }

    const user = this.usersStore.find((u) => u.id === userId);
    if (!user) throw new Error("User not found.");

    if (user.role === "SUPER_ADMIN" && adminRole !== "SUPER_ADMIN") {
      throw new Error("Forbidden: Standard administrators cannot suspend Super Admin accounts.");
    }

    const prevStatus = user.status;
    user.status = "suspended";
    user.suspensionReason = reason || "Administrative suspension";
    if (durationDays && durationDays > 0) {
      const end = new Date();
      end.setDate(end.getDate() + durationDays);
      user.suspensionEndDate = end.toISOString();
    }

    this.logAudit(
      adminRole,
      adminId,
      "SUSPEND_USER",
      `Reason: ${user.suspensionReason}`,
      userId,
      user.email,
      prevStatus,
      "suspended",
      ipAddress
    );

    return { success: true, user: { ...user } };
  }

  // Reactivate User
  public static async reactivateUser(
    adminRole: string,
    adminId: string,
    userId: string,
    ipAddress?: string
  ): Promise<{ success: boolean; user: EnterpriseUser }> {
    if (!AdminRbacEngine.canManageUsers(adminRole)) {
      throw new Error("Forbidden: Insufficient privileges to reactivate user account.");
    }

    const user = this.usersStore.find((u) => u.id === userId);
    if (!user) throw new Error("User not found.");

    const prevStatus = user.status;
    user.status = "active";
    delete user.suspensionReason;
    delete user.suspensionEndDate;

    this.logAudit(
      adminRole,
      adminId,
      "REACTIVATE_USER",
      "Reactivated suspended user account",
      userId,
      user.email,
      prevStatus,
      "active",
      ipAddress
    );

    return { success: true, user: { ...user } };
  }

  // Disable User
  public static async disableUser(
    adminRole: string,
    adminId: string,
    userId: string,
    reason: string,
    ipAddress?: string
  ): Promise<{ success: boolean; user: EnterpriseUser }> {
    if (!AdminRbacEngine.canManageUsers(adminRole)) {
      throw new Error("Forbidden: Insufficient privileges to disable user account.");
    }

    const user = this.usersStore.find((u) => u.id === userId);
    if (!user) throw new Error("User not found.");

    const prevStatus = user.status;
    user.status = "disabled";
    user.suspensionReason = reason || "Disabled by admin";

    this.logAudit(
      adminRole,
      adminId,
      "DISABLE_USER",
      `Reason: ${reason}`,
      userId,
      user.email,
      prevStatus,
      "disabled",
      ipAddress
    );

    return { success: true, user: { ...user } };
  }

  // Delete User
  public static async deleteUser(
    adminRole: string,
    adminId: string,
    userId: string,
    confirmationName: string,
    ipAddress?: string
  ): Promise<{ success: boolean; deletedUserId: string }> {
    if (!AdminRbacEngine.canDeleteUsers(adminRole)) {
      throw new Error("Forbidden: Insufficient privileges to delete user account.");
    }

    const index = this.usersStore.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error("User not found.");

    const user = this.usersStore[index];
    if (confirmationName !== user.email && confirmationName !== user.name) {
      throw new Error("Safety check failed: Confirmation name or email does not match user details.");
    }

    if (user.role === "SUPER_ADMIN") {
      throw new Error("Forbidden: Super Admin accounts cannot be deleted directly.");
    }

    this.usersStore.splice(index, 1);

    this.logAudit(
      adminRole,
      adminId,
      "DELETE_USER",
      `Permanently deleted user ${user.name} (${user.email})`,
      userId,
      user.email,
      user,
      "DELETED",
      ipAddress
    );

    return { success: true, deletedUserId: userId };
  }

  // Reset Password
  public static async resetPassword(
    adminRole: string,
    adminId: string,
    userId: string,
    ipAddress?: string
  ): Promise<{ success: boolean; message: string }> {
    if (!AdminRbacEngine.canManageUsers(adminRole)) {
      throw new Error("Forbidden: Insufficient privileges to send password reset.");
    }

    const user = this.usersStore.find((u) => u.id === userId);
    if (!user) throw new Error("User not found.");

    this.logAudit(
      adminRole,
      adminId,
      "RESET_PASSWORD",
      `Sent password reset link to ${user.email}`,
      userId,
      user.email,
      null,
      "PASSWORD_RESET_SENT",
      ipAddress
    );

    return {
      success: true,
      message: `Password reset instructions sent successfully to ${user.email}.`,
    };
  }

  // Verify Email / Resend Verification
  public static async verifyEmail(
    adminRole: string,
    adminId: string,
    userId: string,
    ipAddress?: string
  ): Promise<{ success: boolean; user: EnterpriseUser }> {
    if (!AdminRbacEngine.canManageUsers(adminRole)) {
      throw new Error("Forbidden: Insufficient privileges.");
    }

    const user = this.usersStore.find((u) => u.id === userId);
    if (!user) throw new Error("User not found.");

    user.emailVerified = true;

    this.logAudit(
      adminRole,
      adminId,
      "VERIFY_EMAIL",
      `Manually verified email for ${user.email}`,
      userId,
      user.email,
      false,
      true,
      ipAddress
    );

    return { success: true, user: { ...user } };
  }

  // Force Logout
  public static async forceLogout(
    adminRole: string,
    adminId: string,
    userId: string,
    ipAddress?: string
  ): Promise<{ success: boolean; message: string }> {
    if (!AdminRbacEngine.canManageUsers(adminRole)) {
      throw new Error("Forbidden: Insufficient privileges to force user logout.");
    }

    const user = this.usersStore.find((u) => u.id === userId);
    if (!user) throw new Error("User not found.");

    this.logAudit(
      adminRole,
      adminId,
      "FORCE_LOGOUT",
      `Revoked active authentication refresh tokens for ${user.email}`,
      userId,
      user.email,
      null,
      "TOKENS_REVOKED",
      ipAddress
    );

    return {
      success: true,
      message: `User ${user.name} active authentication tokens revoked. User forced to sign in again.`,
    };
  }

  // Impersonation Mode
  public static async impersonateUser(
    adminRole: string,
    adminId: string,
    userId: string,
    ipAddress?: string
  ): Promise<{ token: string; user: EnterpriseUser }> {
    if (!AdminRbacEngine.canImpersonateUsers(adminRole)) {
      throw new Error("Forbidden: Impersonation mode is restricted to Super Admin accounts.");
    }

    const user = this.usersStore.find((u) => u.id === userId);
    if (!user) throw new Error("Target user not found.");

    const token = `imp_session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    this.logAudit(
      adminRole,
      adminId,
      "IMPERSONATE_START",
      `Initiated administrative impersonation session for ${user.email}`,
      userId,
      user.email,
      null,
      { token },
      ipAddress
    );

    return { token, user: { ...user } };
  }

  // Export User Data
  public static async exportUserData(
    adminRole: string,
    adminId: string,
    userId: string,
    ipAddress?: string
  ): Promise<string> {
    if (!AdminRbacEngine.canManageUsers(adminRole)) {
      throw new Error("Forbidden: Insufficient permissions to export user data.");
    }

    const user = this.usersStore.find((u) => u.id === userId);
    if (!user) throw new Error("User not found.");

    this.logAudit(
      adminRole,
      adminId,
      "EXPORT_USER_DATA",
      `Exported full GDPR data dump for ${user.email}`,
      userId,
      user.email,
      null,
      "EXPORT_GENERATED",
      ipAddress
    );

    return JSON.stringify(user, null, 2);
  }

  // Bulk Operations
  public static async bulkSuspendUsers(
    adminRole: string,
    adminId: string,
    userIds: string[],
    reason: string,
    ipAddress?: string
  ) {
    if (!AdminRbacEngine.canPerformBulkOperations(adminRole)) {
      throw new Error("Forbidden: Insufficient privileges for bulk operations.");
    }

    const updated: string[] = [];
    userIds.forEach((id) => {
      const u = this.usersStore.find((user) => user.id === id);
      if (u && u.role !== "SUPER_ADMIN") {
        u.status = "suspended";
        u.suspensionReason = reason || "Bulk administrative suspension";
        updated.push(id);
      }
    });

    this.logAudit(
      adminRole,
      adminId,
      "BULK_SUSPEND",
      `Bulk suspended ${updated.length} users. Reason: ${reason}`,
      undefined,
      undefined,
      userIds,
      updated,
      ipAddress
    );

    return { success: true, count: updated.length, userIds: updated };
  }

  public static async bulkDeleteUsers(
    adminRole: string,
    adminId: string,
    userIds: string[],
    ipAddress?: string
  ) {
    if (!AdminRbacEngine.canDeleteUsers(adminRole) || !AdminRbacEngine.canPerformBulkOperations(adminRole)) {
      throw new Error("Forbidden: Only Super Admins can execute bulk user deletions.");
    }

    const deleted: string[] = [];
    this.usersStore = this.usersStore.filter((u) => {
      if (userIds.includes(u.id) && u.role !== "SUPER_ADMIN") {
        deleted.push(u.id);
        return false;
      }
      return true;
    });

    this.logAudit(
      adminRole,
      adminId,
      "BULK_DELETE",
      `Bulk deleted ${deleted.length} user accounts.`,
      undefined,
      undefined,
      userIds,
      deleted,
      ipAddress
    );

    return { success: true, count: deleted.length, deletedUserIds: deleted };
  }

  public static async bulkAssignRoles(
    adminRole: string,
    adminId: string,
    userIds: string[],
    newRole: EnterpriseRole,
    ipAddress?: string
  ) {
    if (!AdminRbacEngine.canManageRoles(adminRole)) {
      throw new Error("Forbidden: Only Super Admins can perform bulk role re-assignments.");
    }

    let count = 0;
    this.usersStore.forEach((u) => {
      if (userIds.includes(u.id)) {
        u.role = newRole;
        count++;
      }
    });

    this.logAudit(
      adminRole,
      adminId,
      "BULK_ASSIGN_ROLE",
      `Assigned role ${newRole} to ${count} users.`,
      undefined,
      undefined,
      userIds,
      newRole,
      ipAddress
    );

    return { success: true, count, newRole };
  }

  public static async bulkAssignPlans(
    adminRole: string,
    adminId: string,
    userIds: string[],
    newPlan: SubscriptionPlanType,
    ipAddress?: string
  ) {
    if (!AdminRbacEngine.canManageSubscriptions(adminRole)) {
      throw new Error("Forbidden: Insufficient privileges for plan assignments.");
    }

    let count = 0;
    this.usersStore.forEach((u) => {
      if (userIds.includes(u.id)) {
        u.subscriptionPlan = newPlan;
        u.subscriptionStatus = newPlan === "FREE" ? "none" : "active";
        count++;
      }
    });

    this.logAudit(
      adminRole,
      adminId,
      "BULK_ASSIGN_PLAN",
      `Assigned subscription plan ${newPlan} to ${count} users.`,
      undefined,
      undefined,
      userIds,
      newPlan,
      ipAddress
    );

    return { success: true, count, newPlan };
  }

  public static async bulkExportUsers(
    adminRole: string,
    adminId: string,
    userIds: string[],
    format: "csv" | "json" = "csv",
    ipAddress?: string
  ) {
    if (!AdminRbacEngine.canManageUsers(adminRole)) {
      throw new Error("Forbidden: Insufficient permissions.");
    }

    const selected = this.usersStore.filter((u) => userIds.includes(u.id));

    this.logAudit(
      adminRole,
      adminId,
      "BULK_EXPORT",
      `Exported ${selected.length} users in ${format.toUpperCase()} format.`,
      undefined,
      undefined,
      userIds,
      format,
      ipAddress
    );

    if (format === "json") {
      return JSON.stringify(selected, null, 2);
    }

    // CSV format
    const headers = ["ID", "Name", "Email", "Role", "Plan", "Status", "Country", "Portfolios", "Joined Date"];
    const rows = selected.map((u) => [
      u.id,
      `"${u.name}"`,
      u.email,
      u.role,
      u.subscriptionPlan,
      u.status,
      `"${u.country}"`,
      u.portfolioCount,
      u.registrationDate,
    ]);

    return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  }

  public static async getAuditLogs(): Promise<AdminAuditLogEntry[]> {
    return [...this.auditLogsStore];
  }
}
