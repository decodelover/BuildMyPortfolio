export type AIAgentStatus = "healthy" | "degraded" | "offline";

export type AIRequestStatus = "completed" | "failed" | "retrying" | "queued";

export type AIQueueJobStatus = "queued" | "running" | "completed" | "failed" | "cancelled";

export type AIJobPriority = "low" | "normal" | "high" | "urgent";

export type AIProviderId = "gemini" | "openai" | "anthropic" | "grok" | "local";

export interface AIOpsOverviewMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTimeMs: number;
  currentQueueSize: number;
  queueHealth: "optimal" | "degraded" | "critical";
  dailyUsageRequests: number;
  monthlyUsageRequests: number;
  peakRequestsPerMin: number;
  activeAIUsers: number;
  tokenConsumption: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  estimatedCostUSD: number;
  modelAvailabilityPercentage: number;
  providerStatus: Record<AIProviderId, "online" | "degraded" | "outage">;
  errorRatePercentage: number;
  successRatePercentage: number;
}

export interface AIAgentInfo {
  id: string;
  name: string;
  description: string;
  status: AIAgentStatus;
  healthScorePercentage: number;
  version: string;
  averageRuntimeMs: number;
  successRatePercentage: number;
  failureRatePercentage: number;
  queueSize: number;
  recentJobsCount: number;
  lastActivity: string;
}

export interface AIRequestLog {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  providerId: AIProviderId;
  modelName: string;
  promptLengthChars: number;
  responseLengthChars: number;
  promptTokens: number;
  completionTokens: number;
  executionTimeMs: number;
  status: AIRequestStatus;
  errorDetails?: string;
  retryCount: number;
  estimatedCostUSD: number;
  promptPreview?: string;
  responsePreview?: string;
}

export interface AIPromptVersion {
  version: string;
  templateText: string;
  createdAt: string;
  updatedByAdmin: string;
  changeNotes: string;
}

export interface AIPromptTemplate {
  id: string;
  name: string;
  description: string;
  category: "Orchestration" | "Content Generation" | "Design System" | "SEO Optimization" | "Quality Assurance" | "Compilation";
  currentVersion: string;
  versions: AIPromptVersion[];
  variables: Array<{ key: string; description: string }>;
  tokenEfficiencyScore: number;
  usageCount: number;
  updatedAt: string;
}

export interface AIModelSupported {
  modelId: string;
  modelName: string;
  costPer1kPromptTokensUSD: number;
  costPer1kCompletionTokensUSD: number;
  maxContextTokens: number;
  isEnabled: boolean;
}

export interface AIProviderConfig {
  id: AIProviderId;
  name: string;
  status: "online" | "degraded" | "outage";
  latencyMs: number;
  availabilityPercentage: number;
  quotaUsedPercentage: number;
  rateLimitRPM: number;
  rateLimitTPM: number;
  supportedModels: AIModelSupported[];
  isDefault: boolean;
}

export interface AIQueueItem {
  id: string;
  customerId: string;
  customerName: string;
  agentId: string;
  agentName: string;
  payloadSummary: string;
  status: AIQueueJobStatus;
  priority: AIJobPriority;
  enqueuedAt: string;
  startedAt?: string;
  completedAt?: string;
  retryCount: number;
  errorReason?: string;
}

export interface AIErrorEntry {
  id: string;
  errorType: "rate_limit" | "timeout" | "provider_outage" | "prompt_error" | "validation_error";
  providerId: AIProviderId;
  agentId: string;
  message: string;
  userId: string;
  timestamp: string;
  statusCode?: number;
}

export interface AIRequestQuery {
  search?: string;
  agentId?: string;
  providerId?: string;
  status?: string;
  sortBy?: "timestamp" | "executionTimeMs" | "estimatedCostUSD" | "promptTokens";
  sortOrder?: "asc" | "desc";
  page: number;
  limit: number;
}

export interface AIRequestQueryResult {
  requests: AIRequestLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
