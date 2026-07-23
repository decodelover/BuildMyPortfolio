import { AdminRbacEngine } from "./admin-rbac-engine";
import { AdminUserService } from "./admin-user-service";
import {
  AdminPortfolio,
  PortfolioDirectoryQuery,
  PortfolioDirectoryResult,
  BulkPortfolioActionRequest,
  AdminPortfolioMediaAsset,
  AdminPortfolioAnalytics,
} from "@/types/admin-portfolio";

const MOCK_PORTFOLIOS_SEED: AdminPortfolio[] = [
  {
    id: "fol_101",
    name: "Alex Morgan — Senior Full Stack & AI Architect",
    ownerId: "usr_101",
    ownerName: "Alex Morgan",
    ownerEmail: "alex.morgan@example.com",
    ownerUsername: "alexmorgan",
    ownerPlan: "PRO",
    customDomain: "alexmorgan.dev",
    subdomain: "alexmorgan.buildmyportfolio.com",
    status: "published",
    visibility: "public",
    templateId: "tpl_modern_dev",
    templateName: "Modern Developer Core",
    themeName: "Dark Glassmorphism",
    seoScore: 98,
    performanceScore: 96,
    storageUsageMB: 450,
    currentVersion: "v3.2",
    createdAt: "2026-01-16T10:00:00Z",
    updatedAt: "2026-07-22T14:40:00Z",
    publishedAt: "2026-01-20T12:00:00Z",
    viewsCount: 14200,
    uniqueVisitors: 9800,
    resumeAttached: true,
    aiGenerationCount: 12,
    mediaAssetsCount: 18,
    versionsHistory: [
      { id: "v_3.2", versionNumber: "v3.2", changeSummary: "Updated case study on AI compiler optimization", createdAt: "2026-07-22T14:40:00Z", createdBy: "usr_101", themeName: "Dark Glassmorphism", templateId: "tpl_modern_dev" },
      { id: "v_3.1", versionNumber: "v3.1", changeSummary: "Added custom domain SSL mapping", createdAt: "2026-05-10T11:00:00Z", createdBy: "usr_101", themeName: "Dark Glassmorphism", templateId: "tpl_modern_dev" },
    ],
    mediaAssets: [
      { id: "ast_1", portfolioId: "fol_101", fileName: "hero-banner.webp", fileType: "image", sizeBytes: 1200000, url: "#", isBroken: false, uploadedAt: "2026-01-16" },
      { id: "ast_2", portfolioId: "fol_101", fileName: "alex_morgan_resume_2026.pdf", fileType: "resume", sizeBytes: 340000, url: "#", isBroken: false, uploadedAt: "2026-01-16" },
    ],
    analytics: {
      portfolioId: "fol_101",
      totalViews: 14200,
      uniqueVisitors: 9800,
      clicksCount: 3400,
      sharesCount: 520,
      resumeDownloadsCount: 1850,
      trafficSources: [
        { source: "Google Search", count: 6800, percentage: 47.8 },
        { source: "LinkedIn", count: 4200, percentage: 29.5 },
        { source: "Direct", count: 2100, percentage: 14.8 },
        { source: "GitHub", count: 1100, percentage: 7.9 },
      ],
      topPages: [
        { path: "/", views: 9800 },
        { path: "/#projects", views: 3200 },
        { path: "/#resume", views: 1200 },
      ],
      seoPerformanceScore: 98,
      performanceScore: 96,
    },
  },
  {
    id: "fol_102",
    name: "TechSolutions Enterprise Showcase",
    ownerId: "usr_102",
    ownerName: "Sarah Chen",
    ownerEmail: "sarah.c@techsolutions.io",
    ownerUsername: "sarahchen",
    ownerPlan: "BUSINESS",
    customDomain: "showcase.techsolutions.io",
    subdomain: "techsolutions.buildmyportfolio.com",
    status: "published",
    visibility: "public",
    templateId: "tpl_enterprise_b2b",
    templateName: "Enterprise B2B Suite",
    themeName: "Corporate Midnight Blue",
    seoScore: 95,
    performanceScore: 92,
    storageUsageMB: 3200,
    currentVersion: "v4.0",
    createdAt: "2025-11-21T09:00:00Z",
    updatedAt: "2026-07-23T01:15:00Z",
    publishedAt: "2025-11-25T10:00:00Z",
    viewsCount: 48900,
    uniqueVisitors: 31200,
    resumeAttached: false,
    aiGenerationCount: 35,
    mediaAssetsCount: 42,
    versionsHistory: [
      { id: "v_4.0", versionNumber: "v4.0", changeSummary: "Q3 Product line rebranding", createdAt: "2026-07-23T01:15:00Z", createdBy: "usr_102", themeName: "Corporate Midnight Blue", templateId: "tpl_enterprise_b2b" },
    ],
    mediaAssets: [
      { id: "ast_3", portfolioId: "fol_102", fileName: "brand-header.png", fileType: "image", sizeBytes: 2400000, url: "#", isBroken: false, uploadedAt: "2025-11-21" },
    ],
    analytics: {
      portfolioId: "fol_102",
      totalViews: 48900,
      uniqueVisitors: 31200,
      clicksCount: 12400,
      sharesCount: 1900,
      resumeDownloadsCount: 0,
      trafficSources: [
        { source: "Direct / Organic", count: 24000, percentage: 49.1 },
        { source: "Google Search", count: 18000, percentage: 36.8 },
        { source: "Twitter / X", count: 6900, percentage: 14.1 },
      ],
      topPages: [
        { path: "/", views: 31200 },
        { path: "/#solutions", views: 12000 },
        { path: "/#contact", views: 5700 },
      ],
      seoPerformanceScore: 95,
      performanceScore: 92,
    },
  },
  {
    id: "fol_103",
    name: "Minimalist Creative Portfolio",
    ownerId: "usr_103",
    ownerName: "David Kim",
    ownerEmail: "david.kim@gmail.com",
    ownerUsername: "dkim_dev",
    ownerPlan: "FREE",
    subdomain: "dkim.buildmyportfolio.com",
    status: "published",
    visibility: "public",
    templateId: "tpl_minimal_clean",
    templateName: "Minimalist Clean",
    themeName: "Light Studio",
    seoScore: 91,
    performanceScore: 99,
    storageUsageMB: 45,
    currentVersion: "v1.0",
    createdAt: "2026-07-01T04:20:00Z",
    updatedAt: "2026-07-01T04:20:00Z",
    publishedAt: "2026-07-01T04:25:00Z",
    viewsCount: 320,
    uniqueVisitors: 210,
    resumeAttached: true,
    aiGenerationCount: 2,
    mediaAssetsCount: 4,
    versionsHistory: [
      { id: "v_1.0", versionNumber: "v1.0", changeSummary: "First published release", createdAt: "2026-07-01T04:20:00Z", createdBy: "usr_103", themeName: "Light Studio", templateId: "tpl_minimal_clean" },
    ],
    mediaAssets: [
      { id: "ast_4", portfolioId: "fol_103", fileName: "david_kim_cv.pdf", fileType: "resume", sizeBytes: 150000, url: "#", isBroken: false, uploadedAt: "2026-07-01" },
    ],
    analytics: {
      portfolioId: "fol_103",
      totalViews: 320,
      uniqueVisitors: 210,
      clicksCount: 85,
      sharesCount: 12,
      resumeDownloadsCount: 45,
      trafficSources: [
        { source: "Direct", count: 200, percentage: 62.5 },
        { source: "LinkedIn", count: 120, percentage: 37.5 },
      ],
      topPages: [{ path: "/", views: 320 }],
      seoPerformanceScore: 91,
      performanceScore: 99,
    },
  },
  {
    id: "fol_104",
    name: "Design Studio & Visual Works",
    ownerId: "usr_104",
    ownerName: "Elena Rostova",
    ownerEmail: "elena.rostova@designstudio.de",
    ownerUsername: "elena_r",
    ownerPlan: "PRO",
    subdomain: "elena-rostova.buildmyportfolio.com",
    status: "flagged",
    visibility: "public",
    templateId: "tpl_creative_gallery",
    templateName: "Creative Gallery",
    themeName: "Neon Cyberpunk",
    seoScore: 84,
    performanceScore: 88,
    storageUsageMB: 680,
    currentVersion: "v2.0",
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-07-15T10:00:00Z",
    viewsCount: 1850,
    uniqueVisitors: 1100,
    resumeAttached: true,
    aiGenerationCount: 8,
    mediaAssetsCount: 22,
    moderationInfo: {
      flaggedAt: "2026-07-15T10:00:00Z",
      flagReason: "Automated copyright check: Unverified high-res image assets & suspicious outbound link pattern.",
      reviewStatus: "pending",
      history: [
        { id: "mod_1", moderatorId: "system_guard", moderatorEmail: "security@buildmyportfolio.com", action: "FLAG", reason: "Automated asset verification flag", timestamp: "2026-07-15T10:00:00Z" },
      ],
    },
    versionsHistory: [],
    mediaAssets: [],
    analytics: {
      portfolioId: "fol_104",
      totalViews: 1850,
      uniqueVisitors: 1100,
      clicksCount: 420,
      sharesCount: 40,
      resumeDownloadsCount: 110,
      trafficSources: [{ source: "Direct", count: 1850, percentage: 100 }],
      topPages: [{ path: "/", views: 1850 }],
      seoPerformanceScore: 84,
      performanceScore: 88,
    },
  },
];

export class AdminPortfolioService {
  private static portfoliosStore: AdminPortfolio[] = [...MOCK_PORTFOLIOS_SEED];

  private static logPortfolioAudit(
    adminRole: string,
    adminId: string,
    action: string,
    details: string,
    portfolioId: string,
    previousValue?: any,
    newValue?: any,
    ipAddress: string = "127.0.0.1"
  ) {
    return AdminUserService.logAudit(
      adminRole,
      adminId,
      `PORTFOLIO_${action}`,
      details,
      portfolioId,
      undefined,
      previousValue,
      newValue,
      ipAddress
    );
  }

  // Get Directory Portfolios
  public static async getPortfolios(query: PortfolioDirectoryQuery): Promise<PortfolioDirectoryResult> {
    let filtered = [...this.portfoliosStore];

    if (query.search && query.search.trim()) {
      const q = query.search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.ownerName.toLowerCase().includes(q) ||
          p.ownerEmail.toLowerCase().includes(q) ||
          p.ownerUsername.toLowerCase().includes(q) ||
          (p.customDomain && p.customDomain.toLowerCase().includes(q)) ||
          p.subdomain.toLowerCase().includes(q)
      );
    }

    if (query.status && query.status !== "ALL") {
      filtered = filtered.filter((p) => p.status.toLowerCase() === query.status?.toLowerCase());
    }

    if (query.visibility && query.visibility !== "ALL") {
      filtered = filtered.filter((p) => p.visibility.toLowerCase() === query.visibility?.toLowerCase());
    }

    if (query.plan && query.plan !== "ALL") {
      filtered = filtered.filter((p) => p.ownerPlan.toUpperCase() === query.plan?.toUpperCase());
    }

    if (query.templateId && query.templateId !== "ALL") {
      filtered = filtered.filter((p) => p.templateId === query.templateId);
    }

    if (query.minSeoScore && query.minSeoScore > 0) {
      filtered = filtered.filter((p) => p.seoScore >= (query.minSeoScore || 0));
    }

    // Sort
    const sortBy = query.sortBy || "updatedAt";
    const sortOrder = query.sortOrder || "desc";
    filtered.sort((a, b) => {
      let valA: any = a[sortBy as keyof AdminPortfolio] ?? "";
      let valB: any = b[sortBy as keyof AdminPortfolio] ?? "";
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const total = filtered.length;
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, query.limit || 10);
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    const stats = {
      totalPortfolios: this.portfoliosStore.length,
      publishedCount: this.portfoliosStore.filter((p) => p.status === "published").length,
      draftCount: this.portfoliosStore.filter((p) => p.status === "draft").length,
      archivedCount: this.portfoliosStore.filter((p) => p.status === "archived").length,
      flaggedCount: this.portfoliosStore.filter((p) => p.status === "flagged").length,
      totalViews: this.portfoliosStore.reduce((sum, p) => sum + p.viewsCount, 0),
    };

    return { portfolios: paginated, total, page, limit, totalPages, stats };
  }

  // Get Single Portfolio 360 Profile
  public static async getPortfolioById(portfolioId: string): Promise<AdminPortfolio | null> {
    const fol = this.portfoliosStore.find((p) => p.id === portfolioId);
    return fol ? { ...fol } : null;
  }

  // Publish Portfolio
  public static async publishPortfolio(adminRole: string, adminId: string, portfolioId: string, ipAddress?: string) {
    if (!AdminRbacEngine.canManageContent(adminRole) && !AdminRbacEngine.canManageUsers(adminRole)) {
      throw new Error("Forbidden.");
    }
    const fol = this.portfoliosStore.find((p) => p.id === portfolioId);
    if (!fol) throw new Error("Portfolio not found.");

    const prevStatus = fol.status;
    fol.status = "published";
    fol.publishedAt = new Date().toISOString();
    fol.updatedAt = new Date().toISOString();

    this.logPortfolioAudit(adminRole, adminId, "PUBLISH", `Published portfolio ${fol.name}`, portfolioId, prevStatus, "published", ipAddress);

    return { success: true, portfolio: { ...fol } };
  }

  // Unpublish Portfolio
  public static async unpublishPortfolio(adminRole: string, adminId: string, portfolioId: string, reason: string, ipAddress?: string) {
    if (!AdminRbacEngine.canManageContent(adminRole)) throw new Error("Forbidden.");
    const fol = this.portfoliosStore.find((p) => p.id === portfolioId);
    if (!fol) throw new Error("Portfolio not found.");

    const prevStatus = fol.status;
    fol.status = "draft";

    this.logPortfolioAudit(adminRole, adminId, "UNPUBLISH", `Unpublished portfolio ${fol.name}. Reason: ${reason}`, portfolioId, prevStatus, "draft", ipAddress);

    return { success: true, portfolio: { ...fol } };
  }

  // Archive Portfolio
  public static async archivePortfolio(adminRole: string, adminId: string, portfolioId: string, ipAddress?: string) {
    if (!AdminRbacEngine.canManageContent(adminRole)) throw new Error("Forbidden.");
    const fol = this.portfoliosStore.find((p) => p.id === portfolioId);
    if (!fol) throw new Error("Portfolio not found.");

    const prevStatus = fol.status;
    fol.status = "archived";

    this.logPortfolioAudit(adminRole, adminId, "ARCHIVE", `Archived portfolio ${fol.name}`, portfolioId, prevStatus, "archived", ipAddress);

    return { success: true, portfolio: { ...fol } };
  }

  // Delete Portfolio
  public static async deletePortfolio(adminRole: string, adminId: string, portfolioId: string, confirmationName: string, ipAddress?: string) {
    if (!AdminRbacEngine.canDeleteUsers(adminRole) && !AdminRbacEngine.canManageContent(adminRole)) {
      throw new Error("Forbidden.");
    }
    const idx = this.portfoliosStore.findIndex((p) => p.id === portfolioId);
    if (idx === -1) throw new Error("Portfolio not found.");

    const fol = this.portfoliosStore[idx];
    if (confirmationName !== fol.name && confirmationName !== fol.id) {
      throw new Error("Safety check failed: Confirmation name does not match portfolio name.");
    }

    this.portfoliosStore.splice(idx, 1);

    this.logPortfolioAudit(adminRole, adminId, "DELETE", `Permanently deleted portfolio ${fol.name}`, portfolioId, fol, "DELETED", ipAddress);

    return { success: true, deletedPortfolioId: portfolioId };
  }

  // Transfer Ownership
  public static async transferOwnership(adminRole: string, adminId: string, portfolioId: string, newOwnerId: string, newOwnerEmail: string, ipAddress?: string) {
    if (!AdminRbacEngine.canManageUsers(adminRole)) throw new Error("Forbidden.");
    const fol = this.portfoliosStore.find((p) => p.id === portfolioId);
    if (!fol) throw new Error("Portfolio not found.");

    const prevOwner = fol.ownerEmail;
    fol.ownerId = newOwnerId;
    fol.ownerEmail = newOwnerEmail;
    fol.ownerName = newOwnerEmail.split("@")[0];

    this.logPortfolioAudit(adminRole, adminId, "TRANSFER_OWNERSHIP", `Transferred portfolio ${fol.name} ownership from ${prevOwner} to ${newOwnerEmail}`, portfolioId, prevOwner, newOwnerEmail, ipAddress);

    return { success: true, portfolio: { ...fol } };
  }

  // Moderation Workflow
  public static async getModerationQueue(): Promise<AdminPortfolio[]> {
    return this.portfoliosStore.filter((p) => p.status === "flagged" || p.moderationInfo?.reviewStatus === "pending");
  }

  public static async approveModeration(adminRole: string, adminId: string, portfolioId: string, notes?: string, ipAddress?: string) {
    if (!AdminRbacEngine.canManageContent(adminRole)) throw new Error("Forbidden.");
    const fol = this.portfoliosStore.find((p) => p.id === portfolioId);
    if (!fol) throw new Error("Portfolio not found.");

    fol.status = "published";
    if (fol.moderationInfo) {
      fol.moderationInfo.reviewStatus = "approved";
      fol.moderationInfo.reviewedBy = adminId;
      fol.moderationInfo.reviewedAt = new Date().toISOString();
      fol.moderationInfo.moderatorNotes = notes || "Approved after review";
    }

    this.logPortfolioAudit(adminRole, adminId, "MODERATE_APPROVE", `Approved moderation for ${fol.name}`, portfolioId, "flagged", "approved", ipAddress);

    return { success: true, portfolio: { ...fol } };
  }

  public static async rejectModeration(adminRole: string, adminId: string, portfolioId: string, reason: string, notes?: string, ipAddress?: string) {
    if (!AdminRbacEngine.canManageContent(adminRole)) throw new Error("Forbidden.");
    const fol = this.portfoliosStore.find((p) => p.id === portfolioId);
    if (!fol) throw new Error("Portfolio not found.");

    fol.status = "archived";
    if (fol.moderationInfo) {
      fol.moderationInfo.reviewStatus = "rejected";
      fol.moderationInfo.reviewedBy = adminId;
      fol.moderationInfo.reviewedAt = new Date().toISOString();
      fol.moderationInfo.moderatorNotes = `Rejected: ${reason}. ${notes || ""}`;
    }

    this.logPortfolioAudit(adminRole, adminId, "MODERATE_REJECT", `Rejected moderation for ${fol.name}. Reason: ${reason}`, portfolioId, "flagged", "rejected", ipAddress);

    return { success: true, portfolio: { ...fol } };
  }

  // Bulk Operations
  public static async bulkOperations(adminRole: string, adminId: string, request: BulkPortfolioActionRequest, ipAddress?: string) {
    if (!AdminRbacEngine.canManageContent(adminRole)) throw new Error("Forbidden.");

    const { action, portfolioIds, payload } = request;
    let count = 0;

    this.portfoliosStore.forEach((fol) => {
      if (portfolioIds.includes(fol.id)) {
        if (action === "publish") fol.status = "published";
        if (action === "unpublish") fol.status = "draft";
        if (action === "archive") fol.status = "archived";
        if (action === "regenerate_seo") fol.seoScore = Math.min(100, fol.seoScore + 5);
        count++;
      }
    });

    if (action === "delete") {
      this.portfoliosStore = this.portfoliosStore.filter((fol) => !portfolioIds.includes(fol.id));
      count = portfolioIds.length;
    }

    this.logPortfolioAudit(adminRole, adminId, `BULK_${action.toUpperCase()}`, `Executed bulk ${action} across ${count} portfolios`, "bulk", portfolioIds, action, ipAddress);

    return { success: true, count, action };
  }
}
