import { AdminRole } from "@/lib/admin/admin-rbac-engine";

export type EnterpriseRole =
  | "USER"
  | "PRO_USER"
  | "BUSINESS_USER"
  | "ADMIN"
  | "SUPER_ADMIN"
  | "SUPPORT_AGENT"
  | "FINANCE_MANAGER"
  | "DEVELOPER"
  | "CONTENT_MANAGER"
  | string;

export type UserAccountStatus = "active" | "disabled" | "suspended" | "pending_verification";

export type SubscriptionPlanType = "FREE" | "PRO" | "BUSINESS" | "ENTERPRISE";

export type SubscriptionStatusType = "active" | "canceled" | "past_due" | "trialing" | "none";

export type AuthProviderType = "email" | "google" | "github" | "saml" | "password";

export interface UserPaymentSummary {
  id: string;
  amount: number;
  currency: string;
  status: "paid" | "failed" | "refunded" | "pending";
  date: string;
  invoiceUrl?: string;
  description: string;
}

export interface UserSupportTicketSummary {
  id: string;
  subject: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  date: string;
}

export interface UserActivityEntry {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface EnterpriseUser {
  id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber?: string;
  photoURL?: string;
  country: string;
  timezone: string;
  registrationDate: string;
  lastLogin: string;
  loginProvider: AuthProviderType;
  role: EnterpriseRole;
  status: UserAccountStatus;
  emailVerified: boolean;
  
  // Subscription & Usage Metrics
  subscriptionPlan: SubscriptionPlanType;
  subscriptionStatus: SubscriptionStatusType;
  portfolioCount: number;
  publishedPortfolioCount: number;
  resumeCount: number;
  storageUsageBytes: number;
  aiUsageCredits: number;

  // Additional Details
  suspensionReason?: string;
  suspensionEndDate?: string;
  paymentHistorySummary: UserPaymentSummary[];
  supportHistory: UserSupportTicketSummary[];
  recentActivity: UserActivityEntry[];
}

export interface UserDirectoryQuery {
  search?: string;
  role?: string;
  plan?: string;
  status?: string;
  country?: string;
  authProvider?: string;
  activity?: string;
  regDateRange?: "all" | "24h" | "7d" | "30d" | "custom";
  lastLoginRange?: "all" | "7d" | "30d" | "inactive30" | "never";
  sortBy?: "name" | "email" | "registrationDate" | "lastLogin" | "role" | "subscriptionPlan" | "portfolioCount";
  sortOrder?: "asc" | "desc";
  page: number;
  limit: number;
}

export interface UserDirectoryResult {
  users: EnterpriseUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: {
    totalUsers: number;
    activeUsers: number;
    suspendedUsers: number;
    proUsers: number;
    businessUsers: number;
    enterpriseUsers: number;
  };
}

export interface AdminAuditLogEntry {
  id: string;
  adminId: string;
  adminEmail: string;
  adminRole: AdminRole | string;
  action: string;
  targetUserId?: string;
  targetUserEmail?: string;
  previousValue?: Record<string, any> | string;
  newValue?: Record<string, any> | string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface BulkActionRequest {
  action: "suspend" | "delete" | "assign_role" | "assign_plan" | "send_notification" | "send_email" | "export";
  userIds: string[];
  payload?: {
    reason?: string;
    newRole?: EnterpriseRole;
    newPlan?: SubscriptionPlanType;
    subject?: string;
    message?: string;
    exportFormat?: "csv" | "json";
  };
}

export interface ImpersonationSession {
  impersonatedUserId: string;
  impersonatorAdminId: string;
  impersonatorAdminRole: AdminRole | string;
  token: string;
  expiresAt: string;
}
