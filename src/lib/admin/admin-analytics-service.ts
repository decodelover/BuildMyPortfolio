import { AdminRbacEngine } from "./admin-rbac-engine";
import { AdminUserService } from "./admin-user-service";
import {
  ExecutiveKpiMetrics,
  UserAnalyticsData,
  PortfolioAnalyticsData,
  AIOperationsAnalyticsData,
  BillingAnalyticsData,
  SystemPerformanceAnalyticsData,
  RealtimeActivityFeedItem,
  AnalyticsFilterQuery,
} from "@/types/admin-analytics";

export class AdminAnalyticsService {
  public static async getExecutiveKpis(query?: AnalyticsFilterQuery): Promise<ExecutiveKpiMetrics> {
    return {
      dailyActiveUsers: 3420,
      weeklyActiveUsers: 14850,
      monthlyActiveUsers: 48200,
      newRegistrationsToday: 184,
      returningUsersPercentage: 68.4,
      revenueTodayUSD: 2450.0,
      revenueMTDUSD: 78450.0,
      mrrUSD: 84200.0,
      arrUSD: 1010400.0,
      activeSubscribers: 1840,
      churnRatePercentage: 1.8,
      trialConversionRatePercentage: 24.5,
      aiRequestsToday: 12450,
      publishedPortfoliosTotal: 8940,
      systemHealthStatus: "HEALTHY",
      comparisonPercentages: {
        dauGrowth: +14.2,
        revenueGrowth: +22.8,
        mrrGrowth: +18.5,
        aiRequestsGrowth: +31.4,
      },
    };
  }

  public static async getUserAnalytics(query?: AnalyticsFilterQuery): Promise<UserAnalyticsData> {
    const tf = query?.timeframe || "30d";
    return {
      timeframe: tf,
      growthTimeSeries: [
        { date: "Jul 1", registrations: 120, activeUsers: 2800 },
        { date: "Jul 5", registrations: 145, activeUsers: 3100 },
        { date: "Jul 10", registrations: 160, activeUsers: 3250 },
        { date: "Jul 15", registrations: 175, activeUsers: 3380 },
        { date: "Jul 20", registrations: 190, activeUsers: 3420 },
      ],
      retentionCohorts: [
        { cohort: "June W1", week1: 100, week2: 78, week3: 65, week4: 58 },
        { cohort: "June W2", week1: 100, week2: 82, week3: 70, week4: 64 },
        { cohort: "June W3", week1: 100, week2: 84, week3: 73, week4: 67 },
      ],
      countryDistribution: [
        { countryCode: "US", countryName: "United States", usersCount: 21400, percentage: 44.4 },
        { countryCode: "DE", countryName: "Germany", usersCount: 6800, percentage: 14.1 },
        { countryCode: "GB", countryName: "United Kingdom", usersCount: 5900, percentage: 12.2 },
        { countryCode: "CA", countryName: "Canada", usersCount: 4100, percentage: 8.5 },
        { countryCode: "NG", countryName: "Nigeria", usersCount: 3200, percentage: 6.6 },
        { countryCode: "JP", countryName: "Japan", usersCount: 2800, percentage: 5.8 },
      ],
      deviceDistribution: [
        { deviceType: "Desktop", count: 32800, percentage: 68.0 },
        { deviceType: "Mobile", count: 12500, percentage: 26.0 },
        { deviceType: "Tablet", count: 2900, percentage: 6.0 },
      ],
      browserDistribution: [
        { browserName: "Google Chrome", count: 31000, percentage: 64.3 },
        { browserName: "Apple Safari", count: 9800, percentage: 20.3 },
        { browserName: "Mozilla Firefox", count: 4200, percentage: 8.7 },
        { browserName: "Microsoft Edge", count: 3200, percentage: 6.7 },
      ],
      trafficSources: [
        { sourceName: "Google Organic Search", count: 22400, percentage: 46.5 },
        { sourceName: "Direct Subdomain Visits", count: 12100, percentage: 25.1 },
        { sourceName: "LinkedIn / Social", count: 8900, percentage: 18.5 },
        { sourceName: "GitHub Referrals", count: 4800, percentage: 9.9 },
      ],
    };
  }

  public static async getPortfolioAnalytics(query?: AnalyticsFilterQuery): Promise<PortfolioAnalyticsData> {
    const tf = query?.timeframe || "30d";
    return {
      timeframe: tf,
      portfoliosCreatedTotal: 12450,
      publishedPortfoliosCount: 8940,
      draftPortfoliosCount: 3510,
      customDomainAdoptionCount: 1840,
      templatePopularity: [
        { templateId: "tpl_modern_dev", templateName: "Modern Developer Core", count: 5400, percentage: 43.4 },
        { templateId: "tpl_enterprise_b2b", templateName: "Enterprise B2B Suite", count: 3100, percentage: 24.9 },
        { templateId: "tpl_creative_gallery", templateName: "Creative Gallery", count: 2200, percentage: 17.7 },
        { templateId: "tpl_minimal_clean", templateName: "Minimalist Clean", count: 1750, percentage: 14.0 },
      ],
      viewsTimeSeries: [
        { date: "Jul 1", totalViews: 12400, uniqueVisitors: 8200 },
        { date: "Jul 10", totalViews: 14800, uniqueVisitors: 9800 },
        { date: "Jul 20", totalViews: 18200, uniqueVisitors: 12100 },
      ],
      topPortfoliosByViews: [
        { id: "fol_102", name: "TechSolutions Enterprise Showcase", ownerName: "Sarah Chen", views: 48900 },
        { id: "fol_101", name: "Alex Morgan — Senior Full Stack Architect", ownerName: "Alex Morgan", views: 14200 },
        { id: "fol_104", name: "Design Studio & Visual Works", ownerName: "Elena Rostova", views: 1850 },
      ],
      resumeDownloadsTotal: 8420,
      portfolioSharesTotal: 3410,
    };
  }

  public static async getAIOperationsAnalytics(query?: AnalyticsFilterQuery): Promise<AIOperationsAnalyticsData> {
    const tf = query?.timeframe || "30d";
    return {
      timeframe: tf,
      totalRequests: 248500,
      successRatePercentage: 99.4,
      failedRequestsCount: 1490,
      averageGenerationTimeMs: 1350,
      providerBreakdown: [
        { providerId: "google-gemini", providerName: "Google Gemini 1.5 Pro / Flash", requestsCount: 168000, percentage: 67.6 },
        { providerId: "openai", providerName: "OpenAI GPT-4o / O1 Mini", requestsCount: 48000, percentage: 19.3 },
        { providerId: "anthropic", providerName: "Anthropic Claude 3.5 Sonnet", requestsCount: 22500, percentage: 9.1 },
        { providerId: "grok", providerName: "xAI Grok-2", requestsCount: 10000, percentage: 4.0 },
      ],
      agentBreakdown: [
        { agentId: "compiler-agent", agentName: "Portfolio Compiler Agent", requestsCount: 98000, percentage: 39.4 },
        { agentId: "content-agent", agentName: "Content & Bio Generation Agent", requestsCount: 64000, percentage: 25.8 },
        { agentId: "design-agent", agentName: "Design & Theme Engine Agent", requestsCount: 42000, percentage: 16.9 },
        { agentId: "seo-agent", agentName: "SEO Meta Optimization Agent", requestsCount: 28500, percentage: 11.5 },
        { agentId: "qa-agent", agentName: "QA Validation Agent", requestsCount: 16000, percentage: 6.4 },
      ],
      promptCategoryBreakdown: [
        { category: "Portfolio Layout Generation", count: 98000 },
        { category: "Developer Bio & Resume Enhancement", count: 64000 },
        { category: "CSS & Design Tokens Styling", count: 42000 },
        { category: "SEO Meta Tags & Keywords", count: 28500 },
      ],
      estimatedCostUSD: 412.5,
      peakRpm: 145,
    };
  }

  public static async getBillingAnalytics(query?: AnalyticsFilterQuery): Promise<BillingAnalyticsData> {
    const tf = query?.timeframe || "30d";
    return {
      timeframe: tf,
      mrrUSD: 84200.0,
      arrUSD: 1010400.0,
      revenueTimeSeries: [
        { date: "May 2026", revenue: 64000, mrr: 68000 },
        { date: "Jun 2026", revenue: 72000, mrr: 76000 },
        { date: "Jul 2026", revenue: 78450, mrr: 84200 },
      ],
      planDistribution: [
        { planType: "FREE", count: 42000, percentage: 87.1 },
        { planType: "PRO", count: 4800, percentage: 10.0 },
        { planType: "BUSINESS", count: 1200, percentage: 2.5 },
        { planType: "ENTERPRISE", count: 200, percentage: 0.4 },
      ],
      paymentSuccessRatePercentage: 98.6,
      refundRatePercentage: 0.4,
      couponsRedeemedCount: 340,
      referralRevenueUSD: 14200.0,
      upgradeRatePercentage: 4.8,
      downgradeRatePercentage: 0.6,
    };
  }

  public static async getSystemPerformanceAnalytics(): Promise<SystemPerformanceAnalyticsData> {
    return {
      apiLatencyP50Ms: 120,
      apiLatencyP95Ms: 340,
      apiLatencyP99Ms: 780,
      databaseQueryAvgMs: 18,
      storageUsageGB: 450,
      bandwidthUsageGB: 3200,
      activeQueueJobs: 4,
      buildSuccessRatePercentage: 100.0,
      serverActionsPerMin: 320,
    };
  }

  public static async getRealtimeFeed(): Promise<RealtimeActivityFeedItem[]> {
    return [
      { id: "act_1", timestamp: new Date().toISOString(), type: "REGISTRATION", title: "New Developer Signup", description: "Marcus Vance created a new account.", userEmail: "m.vance@dev.io" },
      { id: "act_2", timestamp: new Date(Date.now() - 45000).toISOString(), type: "PORTFOLIO_PUBLISH", title: "Portfolio Published", description: "Published 'AI Research Portfolio' on custom domain.", userEmail: "research@ai.org" },
      { id: "act_3", timestamp: new Date(Date.now() - 120000).toISOString(), type: "SUBSCRIPTION_UPGRADE", title: "Plan Upgraded to BUSINESS", description: "Upgraded from PRO to BUSINESS plan.", userEmail: "sarah.c@techsolutions.io", amountUSD: 99 },
      { id: "act_4", timestamp: new Date(Date.now() - 300000).toISOString(), type: "AI_GENERATION", title: "AI Blueprint Completed", description: "Compiler Agent rendered layout in 1,240 ms." },
    ];
  }
}
