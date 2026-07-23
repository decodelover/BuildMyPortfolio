export type AnalyticsTimeframeType = "today" | "7d" | "30d" | "90d" | "1y" | "custom";

export interface AnalyticsFilterQuery {
  timeframe?: AnalyticsTimeframeType;
  startDate?: string;
  endDate?: string;
  country?: string;
  plan?: string;
  device?: string;
  trafficSource?: string;
}

export interface ExecutiveKpiMetrics {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  newRegistrationsToday: number;
  returningUsersPercentage: number;
  revenueTodayUSD: number;
  revenueMTDUSD: number;
  mrrUSD: number;
  arrUSD: number;
  activeSubscribers: number;
  churnRatePercentage: number;
  trialConversionRatePercentage: number;
  aiRequestsToday: number;
  publishedPortfoliosTotal: number;
  systemHealthStatus: "HEALTHY" | "DEGRADED" | "CRITICAL";
  comparisonPercentages: {
    dauGrowth: number;
    revenueGrowth: number;
    mrrGrowth: number;
    aiRequestsGrowth: number;
  };
}

export interface UserAnalyticsData {
  timeframe: AnalyticsTimeframeType;
  growthTimeSeries: Array<{ date: string; registrations: number; activeUsers: number }>;
  retentionCohorts: Array<{ cohort: string; week1: number; week2: number; week3: number; week4: number }>;
  countryDistribution: Array<{ countryCode: string; countryName: string; usersCount: number; percentage: number }>;
  deviceDistribution: Array<{ deviceType: string; count: number; percentage: number }>;
  browserDistribution: Array<{ browserName: string; count: number; percentage: number }>;
  trafficSources: Array<{ sourceName: string; count: number; percentage: number }>;
}

export interface PortfolioAnalyticsData {
  timeframe: AnalyticsTimeframeType;
  portfoliosCreatedTotal: number;
  publishedPortfoliosCount: number;
  draftPortfoliosCount: number;
  customDomainAdoptionCount: number;
  templatePopularity: Array<{ templateId: string; templateName: string; count: number; percentage: number }>;
  viewsTimeSeries: Array<{ date: string; totalViews: number; uniqueVisitors: number }>;
  topPortfoliosByViews: Array<{ id: string; name: string; ownerName: string; views: number }>;
  resumeDownloadsTotal: number;
  portfolioSharesTotal: number;
}

export interface AIOperationsAnalyticsData {
  timeframe: AnalyticsTimeframeType;
  totalRequests: number;
  successRatePercentage: number;
  failedRequestsCount: number;
  averageGenerationTimeMs: number;
  providerBreakdown: Array<{ providerId: string; providerName: string; requestsCount: number; percentage: number }>;
  agentBreakdown: Array<{ agentId: string; agentName: string; requestsCount: number; percentage: number }>;
  promptCategoryBreakdown: Array<{ category: string; count: number }>;
  estimatedCostUSD: number;
  peakRpm: number;
}

export interface BillingAnalyticsData {
  timeframe: AnalyticsTimeframeType;
  mrrUSD: number;
  arrUSD: number;
  revenueTimeSeries: Array<{ date: string; revenue: number; mrr: number }>;
  planDistribution: Array<{ planType: string; count: number; percentage: number }>;
  paymentSuccessRatePercentage: number;
  refundRatePercentage: number;
  couponsRedeemedCount: number;
  referralRevenueUSD: number;
  upgradeRatePercentage: number;
  downgradeRatePercentage: number;
}

export interface SystemPerformanceAnalyticsData {
  apiLatencyP50Ms: number;
  apiLatencyP95Ms: number;
  apiLatencyP99Ms: number;
  databaseQueryAvgMs: number;
  storageUsageGB: number;
  bandwidthUsageGB: number;
  activeQueueJobs: number;
  buildSuccessRatePercentage: number;
  serverActionsPerMin: number;
}

export interface RealtimeActivityFeedItem {
  id: string;
  timestamp: string;
  type: "REGISTRATION" | "PORTFOLIO_PUBLISH" | "AI_GENERATION" | "PAYMENT_SUCCESS" | "SUBSCRIPTION_UPGRADE";
  title: string;
  description: string;
  userEmail?: string;
  amountUSD?: number;
}
