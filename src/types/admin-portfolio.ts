import { SubscriptionPlanType } from "./admin-user";

export type PortfolioStatusType = "published" | "draft" | "archived" | "flagged";

export type PortfolioVisibilityType = "public" | "private" | "unlisted" | "password_protected";

export type ModerationStatusType = "pending" | "approved" | "rejected";

export interface ModerationLogEntry {
  id: string;
  moderatorId: string;
  moderatorEmail: string;
  action: "FLAG" | "APPROVE" | "REJECT" | "UNPUBLISH";
  reason: string;
  notes?: string;
  timestamp: string;
}

export interface AdminPortfolioVersion {
  id: string;
  versionNumber: string;
  changeSummary: string;
  createdAt: string;
  createdBy: string;
  themeName: string;
  templateId: string;
}

export interface AdminPortfolioMediaAsset {
  id: string;
  portfolioId: string;
  fileName: string;
  fileType: "image" | "document" | "resume" | "video" | "icon";
  sizeBytes: number;
  url: string;
  isBroken: boolean;
  uploadedAt: string;
}

export interface AdminPortfolioAnalytics {
  portfolioId: string;
  totalViews: number;
  uniqueVisitors: number;
  clicksCount: number;
  sharesCount: number;
  resumeDownloadsCount: number;
  trafficSources: Array<{ source: string; count: number; percentage: number }>;
  topPages: Array<{ path: string; views: number }>;
  seoPerformanceScore: number;
  performanceScore: number;
}

export interface AdminPortfolio {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerUsername: string;
  ownerPlan: SubscriptionPlanType;
  customDomain?: string;
  subdomain: string;
  status: PortfolioStatusType;
  visibility: PortfolioVisibilityType;
  templateId: string;
  templateName: string;
  themeName: string;
  seoScore: number;
  performanceScore: number;
  storageUsageMB: number;
  currentVersion: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  viewsCount: number;
  uniqueVisitors: number;
  resumeAttached: boolean;
  aiGenerationCount: number;
  mediaAssetsCount: number;
  moderationInfo?: {
    flaggedAt?: string;
    flagReason?: string;
    reviewStatus: ModerationStatusType;
    moderatorNotes?: string;
    reviewedBy?: string;
    reviewedAt?: string;
    history: ModerationLogEntry[];
  };
  versionsHistory: AdminPortfolioVersion[];
  mediaAssets: AdminPortfolioMediaAsset[];
  analytics: AdminPortfolioAnalytics;
}

export interface PortfolioDirectoryQuery {
  search?: string;
  status?: string;
  visibility?: string;
  templateId?: string;
  plan?: string;
  minSeoScore?: number;
  minPerformanceScore?: number;
  regDateRange?: "all" | "24h" | "7d" | "30d";
  sortBy?: "name" | "createdAt" | "updatedAt" | "viewsCount" | "seoScore" | "performanceScore";
  sortOrder?: "asc" | "desc";
  page: number;
  limit: number;
}

export interface PortfolioDirectoryResult {
  portfolios: AdminPortfolio[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: {
    totalPortfolios: number;
    publishedCount: number;
    draftCount: number;
    archivedCount: number;
    flaggedCount: number;
    totalViews: number;
  };
}

export interface BulkPortfolioActionRequest {
  action: "publish" | "unpublish" | "archive" | "delete" | "transfer" | "export" | "regenerate_seo";
  portfolioIds: string[];
  payload?: {
    newOwnerId?: string;
    exportFormat?: "csv" | "json";
    reason?: string;
  };
}
