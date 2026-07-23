import { AdminRbacEngine } from "./admin-rbac-engine";
import { AdminUserService } from "./admin-user-service";
import {
  AIOpsOverviewMetrics,
  AIAgentInfo,
  AIRequestLog,
  AIPromptTemplate,
  AIProviderConfig,
  AIQueueItem,
  AIErrorEntry,
  AIRequestQuery,
  AIRequestQueryResult,
  AIJobPriority,
} from "@/types/admin-ai-ops";

const MOCK_AGENTS_SEED: AIAgentInfo[] = [
  {
    id: "content-agent",
    name: "Content Generation Agent",
    description: "Synthesizes bio, hero headlines, work experiences, skills, and portfolio case study copy.",
    status: "healthy",
    healthScorePercentage: 99.4,
    version: "v2.4.0",
    averageRuntimeMs: 420,
    successRatePercentage: 99.2,
    failureRatePercentage: 0.8,
    queueSize: 2,
    recentJobsCount: 1420,
    lastActivity: new Date().toISOString(),
  },
  {
    id: "design-agent",
    name: "Design & Theme Engine Agent",
    description: "Generates custom CSS color schemes, glassmorphism tokens, typography pairings, and layout structures.",
    status: "healthy",
    healthScorePercentage: 98.8,
    version: "v3.1.2",
    averageRuntimeMs: 610,
    successRatePercentage: 98.5,
    failureRatePercentage: 1.5,
    queueSize: 0,
    recentJobsCount: 980,
    lastActivity: new Date().toISOString(),
  },
  {
    id: "seo-agent",
    name: "SEO & OpenGraph Agent",
    description: "Optimizes meta tags, schema.org JSON-LD structured data, sitemap tags, and social share previews.",
    status: "healthy",
    healthScorePercentage: 100.0,
    version: "v1.9.0",
    averageRuntimeMs: 180,
    successRatePercentage: 100.0,
    failureRatePercentage: 0.0,
    queueSize: 0,
    recentJobsCount: 750,
    lastActivity: new Date().toISOString(),
  },
  {
    id: "qa-agent",
    name: "Quality Assurance & Accessibility Agent",
    description: "Evaluates WCAG AAA color contrast, mobile responsiveness, link safety, and HTML semantics.",
    status: "healthy",
    healthScorePercentage: 97.6,
    version: "v2.0.1",
    averageRuntimeMs: 340,
    successRatePercentage: 97.5,
    failureRatePercentage: 2.5,
    queueSize: 1,
    recentJobsCount: 1100,
    lastActivity: new Date().toISOString(),
  },
  {
    id: "compiler-agent",
    name: "Portfolio & Asset Compiler Agent",
    description: "Bundles TSX AST trees, injects styling tokens, optimizes image assets, and compiles preview manifests.",
    status: "healthy",
    healthScorePercentage: 99.9,
    version: "v4.0.0",
    averageRuntimeMs: 850,
    successRatePercentage: 99.8,
    failureRatePercentage: 0.2,
    queueSize: 3,
    recentJobsCount: 2300,
    lastActivity: new Date().toISOString(),
  },
];

const MOCK_PROMPTS_SEED: AIPromptTemplate[] = [
  {
    id: "p_content_builder",
    name: "Portfolio Content Synthesis",
    description: "Generates impact-driven software developer case studies and career summaries.",
    category: "Content Generation",
    currentVersion: "v2.1",
    versions: [
      {
        version: "v2.1",
        templateText: "You are an elite Tech Career Strategist. Synthesize user inputs: {{rawProfile}} into compelling case studies highlighting quantifiable metrics (e.g. +40% latency reduction). Format as JSON.",
        createdAt: "2026-06-10",
        updatedByAdmin: "marcus.vance@globalcorp.com",
        changeNotes: "Added JSON output constraint and metric emphasis",
      },
      {
        version: "v2.0",
        templateText: "Generate professional portfolio copy based on input {{rawProfile}}.",
        createdAt: "2026-03-01",
        updatedByAdmin: "admin@buildmyportfolio.com",
        changeNotes: "Initial version",
      },
    ],
    variables: [
      { key: "rawProfile", description: "User provided raw resume or experience summary text" },
    ],
    tokenEfficiencyScore: 94,
    usageCount: 4200,
    updatedAt: "2026-06-10",
  },
  {
    id: "p_design_tokens",
    name: "CSS Token & Glassmorphism Generator",
    description: "Computes WCAG compliant color palettes and CSS variables for web layouts.",
    category: "Design System",
    currentVersion: "v1.4",
    versions: [
      {
        version: "v1.4",
        templateText: "Generate HSL color tokens for theme preset {{themeName}}. Ensure contrast ratio between text and background is >= 4.5:1.",
        createdAt: "2026-05-18",
        updatedByAdmin: "marcus.vance@globalcorp.com",
        changeNotes: "Enforced WCAG AAA contrast ratio rule",
      },
    ],
    variables: [
      { key: "themeName", description: "Selected portfolio design theme identifier" },
    ],
    tokenEfficiencyScore: 98,
    usageCount: 2900,
    updatedAt: "2026-05-18",
  },
];

const MOCK_PROVIDERS_SEED: AIProviderConfig[] = [
  {
    id: "gemini",
    name: "Google Gemini 1.5 Pro / Flash",
    status: "online",
    latencyMs: 320,
    availabilityPercentage: 99.98,
    quotaUsedPercentage: 38.5,
    rateLimitRPM: 10000,
    rateLimitTPM: 4000000,
    supportedModels: [
      { modelId: "gemini-1.5-pro", modelName: "Gemini 1.5 Pro", costPer1kPromptTokensUSD: 0.00125, costPer1kCompletionTokensUSD: 0.00375, maxContextTokens: 2000000, isEnabled: true },
      { modelId: "gemini-1.5-flash", modelName: "Gemini 1.5 Flash", costPer1kPromptTokensUSD: 0.00035, costPer1kCompletionTokensUSD: 0.0007, maxContextTokens: 1000000, isEnabled: true },
    ],
    isDefault: true,
  },
  {
    id: "openai",
    name: "OpenAI GPT-4o",
    status: "online",
    latencyMs: 480,
    availabilityPercentage: 99.9,
    quotaUsedPercentage: 12.0,
    rateLimitRPM: 5000,
    rateLimitTPM: 2000000,
    supportedModels: [
      { modelId: "gpt-4o", modelName: "GPT-4o", costPer1kPromptTokensUSD: 0.005, costPer1kCompletionTokensUSD: 0.015, maxContextTokens: 128000, isEnabled: true },
      { modelId: "gpt-4o-mini", modelName: "GPT-4o Mini", costPer1kPromptTokensUSD: 0.00015, costPer1kCompletionTokensUSD: 0.0006, maxContextTokens: 128000, isEnabled: true },
    ],
    isDefault: false,
  },
  {
    id: "anthropic",
    name: "Anthropic Claude 3.5 Sonnet",
    status: "online",
    latencyMs: 510,
    availabilityPercentage: 99.8,
    quotaUsedPercentage: 5.4,
    rateLimitRPM: 2000,
    rateLimitTPM: 1000000,
    supportedModels: [
      { modelId: "claude-3-5-sonnet", modelName: "Claude 3.5 Sonnet", costPer1kPromptTokensUSD: 0.003, costPer1kCompletionTokensUSD: 0.015, maxContextTokens: 200000, isEnabled: true },
    ],
    isDefault: false,
  },
  {
    id: "grok",
    name: "xAI Grok Enterprise",
    status: "online",
    latencyMs: 440,
    availabilityPercentage: 99.5,
    quotaUsedPercentage: 0.0,
    rateLimitRPM: 1000,
    rateLimitTPM: 500000,
    supportedModels: [
      { modelId: "grok-beta", modelName: "Grok Beta", costPer1kPromptTokensUSD: 0.005, costPer1kCompletionTokensUSD: 0.015, maxContextTokens: 128000, isEnabled: false },
    ],
    isDefault: false,
  },
];

const MOCK_REQUESTS_SEED: AIRequestLog[] = [
  {
    id: "req_801",
    userId: "usr_101",
    userName: "Alex Morgan",
    timestamp: "2026-07-23T02:45:00Z",
    agentId: "content-agent",
    agentName: "Content Generation Agent",
    providerId: "gemini",
    modelName: "gemini-1.5-pro",
    promptLengthChars: 1250,
    responseLengthChars: 3400,
    promptTokens: 420,
    completionTokens: 890,
    executionTimeMs: 410,
    status: "completed",
    retryCount: 0,
    estimatedCostUSD: 0.0038,
    promptPreview: "Synthesize user profile experiences into senior full stack engineer case study...",
    responsePreview: "{ \"heroHeadline\": \"Senior Full Stack & AI Architect\", \"summary\": \"Specializing in distributed systems...\" }",
  },
  {
    id: "req_802",
    userId: "usr_102",
    userName: "Sarah Chen",
    timestamp: "2026-07-23T02:44:12Z",
    agentId: "design-agent",
    agentName: "Design & Theme Engine Agent",
    providerId: "gemini",
    modelName: "gemini-1.5-flash",
    promptLengthChars: 800,
    responseLengthChars: 1900,
    promptTokens: 210,
    completionTokens: 540,
    executionTimeMs: 290,
    status: "completed",
    retryCount: 0,
    estimatedCostUSD: 0.00045,
  },
  {
    id: "req_803",
    userId: "usr_104",
    userName: "Elena Rostova",
    timestamp: "2026-07-23T02:40:00Z",
    agentId: "compiler-agent",
    agentName: "Portfolio & Asset Compiler Agent",
    providerId: "gemini",
    modelName: "gemini-1.5-pro",
    promptLengthChars: 2100,
    responseLengthChars: 0,
    promptTokens: 650,
    completionTokens: 0,
    executionTimeMs: 1200,
    status: "failed",
    errorDetails: "Rate limit exceeded (HTTP 429). Retry scheduled.",
    retryCount: 2,
    estimatedCostUSD: 0.0008,
  },
];

const MOCK_QUEUE_SEED: AIQueueItem[] = [
  {
    id: "job_9901",
    customerId: "usr_101",
    customerName: "Alex Morgan",
    agentId: "compiler-agent",
    agentName: "Portfolio Compiler",
    payloadSummary: "Full TSX bundle compilation for dev-portfolio-v2",
    status: "running",
    priority: "high",
    enqueuedAt: "2026-07-23T02:49:10Z",
    startedAt: "2026-07-23T02:49:12Z",
    retryCount: 0,
  },
  {
    id: "job_9902",
    customerId: "usr_102",
    customerName: "Sarah Chen",
    agentId: "qa-agent",
    agentName: "Quality Assurance Agent",
    payloadSummary: "WCAG AAA contrast audit for techsolutions-corp",
    status: "queued",
    priority: "normal",
    enqueuedAt: "2026-07-23T02:49:15Z",
    retryCount: 0,
  },
  {
    id: "job_9903",
    customerId: "usr_108",
    customerName: "Amara Okezie",
    agentId: "seo-agent",
    agentName: "SEO Agent",
    payloadSummary: "OpenGraph tag generation for fin-tech-portal",
    status: "queued",
    priority: "normal",
    enqueuedAt: "2026-07-23T02:49:20Z",
    retryCount: 0,
  },
];

export class AdminAIOpsService {
  private static agentsStore: AIAgentInfo[] = [...MOCK_AGENTS_SEED];
  private static promptsStore: AIPromptTemplate[] = [...MOCK_PROMPTS_SEED];
  private static providersStore: AIProviderConfig[] = [...MOCK_PROVIDERS_SEED];
  private static requestsStore: AIRequestLog[] = [...MOCK_REQUESTS_SEED];
  private static queueStore: AIQueueItem[] = [...MOCK_QUEUE_SEED];

  private static logAIOpsAudit(
    adminRole: string,
    adminId: string,
    action: string,
    details: string,
    targetId?: string,
    prev?: any,
    next?: any
  ) {
    return AdminUserService.logAudit(
      adminRole,
      adminId,
      `AI_OPS_${action}`,
      details,
      targetId,
      undefined,
      prev,
      next
    );
  }

  // Live Metrics
  public static async getMetrics(): Promise<AIOpsOverviewMetrics> {
    const total = this.requestsStore.length + 15420;
    const failed = 84;
    const success = total - failed;

    return {
      totalRequests: total,
      successfulRequests: success,
      failedRequests: failed,
      averageResponseTimeMs: 385,
      currentQueueSize: this.queueStore.filter((q) => q.status === "queued" || q.status === "running").length,
      queueHealth: "optimal",
      dailyUsageRequests: 4120,
      monthlyUsageRequests: 115400,
      peakRequestsPerMin: 185,
      activeAIUsers: 640,
      tokenConsumption: {
        promptTokens: 45200000,
        completionTokens: 98100000,
        totalTokens: 143300000,
      },
      estimatedCostUSD: 148.5,
      modelAvailabilityPercentage: 99.98,
      providerStatus: {
        gemini: "online",
        openai: "online",
        anthropic: "online",
        grok: "online",
        local: "online",
      },
      errorRatePercentage: 0.54,
      successRatePercentage: 99.46,
    };
  }

  // Agents
  public static async getAgents(): Promise<AIAgentInfo[]> {
    return [...this.agentsStore];
  }

  public static async runAgentDiagnostics(adminRole: string, adminId: string, agentId: string) {
    if (!AdminRbacEngine.canManageSystemSettings(adminRole)) throw new Error("Forbidden.");

    const agent = this.agentsStore.find((a) => a.id === agentId);
    if (!agent) throw new Error("Agent not found.");

    agent.healthScorePercentage = 100.0;
    agent.lastActivity = new Date().toISOString();

    this.logAIOpsAudit(adminRole, adminId, "DIAGNOSTICS_RUN", `Ran diagnostic health check on ${agent.name}`, agentId);

    return { success: true, agent: { ...agent }, diagnosticReport: { latencyMs: agent.averageRuntimeMs, memoryMB: 128, status: "HEALTHY" } };
  }

  // Requests Log Query
  public static async getRequests(query: AIRequestQuery): Promise<AIRequestQueryResult> {
    let filtered = [...this.requestsStore];

    if (query.search && query.search.trim()) {
      const q = query.search.toLowerCase().trim();
      filtered = filtered.filter(
        (r) =>
          r.userName.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.agentName.toLowerCase().includes(q)
      );
    }

    if (query.agentId && query.agentId !== "ALL") {
      filtered = filtered.filter((r) => r.agentId === query.agentId);
    }

    if (query.providerId && query.providerId !== "ALL") {
      filtered = filtered.filter((r) => r.providerId === query.providerId);
    }

    if (query.status && query.status !== "ALL") {
      filtered = filtered.filter((r) => r.status === query.status);
    }

    const total = filtered.length;
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, query.limit || 10);
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return { requests: paginated, total, page, limit, totalPages };
  }

  // Prompts Repository
  public static async getPrompts(): Promise<AIPromptTemplate[]> {
    return [...this.promptsStore];
  }

  public static async updatePromptTemplate(
    adminRole: string,
    adminId: string,
    promptId: string,
    templateText: string,
    changeNotes: string
  ) {
    if (!AdminRbacEngine.canManageContent(adminRole) && !AdminRbacEngine.canManageSystemSettings(adminRole)) {
      throw new Error("Forbidden: Insufficient privileges to modify prompt templates.");
    }

    const prompt = this.promptsStore.find((p) => p.id === promptId);
    if (!prompt) throw new Error("Prompt template not found.");

    const newVersionNumber = `v${(parseFloat(prompt.currentVersion.replace("v", "")) + 0.1).toFixed(1)}`;
    const newVersion = {
      version: newVersionNumber,
      templateText,
      createdAt: new Date().toISOString().split("T")[0],
      updatedByAdmin: adminId,
      changeNotes,
    };

    prompt.versions.unshift(newVersion);
    prompt.currentVersion = newVersionNumber;
    prompt.updatedAt = new Date().toISOString().split("T")[0];

    this.logAIOpsAudit(
      adminRole,
      adminId,
      "UPDATE_PROMPT",
      `Updated prompt template ${prompt.name} to version ${newVersionNumber}`,
      promptId,
      null,
      newVersion
    );

    return { success: true, prompt: { ...prompt } };
  }

  public static async rollbackPromptTemplate(
    adminRole: string,
    adminId: string,
    promptId: string,
    targetVersion: string
  ) {
    if (!AdminRbacEngine.canManageSystemSettings(adminRole)) throw new Error("Forbidden.");

    const prompt = this.promptsStore.find((p) => p.id === promptId);
    if (!prompt) throw new Error("Prompt template not found.");

    const target = prompt.versions.find((v) => v.version === targetVersion);
    if (!target) throw new Error("Target version not found.");

    const prevVersion = prompt.currentVersion;
    prompt.currentVersion = targetVersion;

    this.logAIOpsAudit(
      adminRole,
      adminId,
      "ROLLBACK_PROMPT",
      `Rolled back prompt template ${prompt.name} from ${prevVersion} to ${targetVersion}`,
      promptId,
      prevVersion,
      targetVersion
    );

    return { success: true, prompt: { ...prompt } };
  }

  // Provider Gateway
  public static async getProviders(): Promise<AIProviderConfig[]> {
    return [...this.providersStore];
  }

  // Queue Management
  public static async getQueue(): Promise<AIQueueItem[]> {
    return [...this.queueStore];
  }

  public static async retryQueueJob(adminRole: string, adminId: string, jobId: string) {
    if (!AdminRbacEngine.canManageSystemSettings(adminRole)) throw new Error("Forbidden.");

    const job = this.queueStore.find((j) => j.id === jobId);
    if (!job) throw new Error("Job not found.");

    job.status = "queued";
    job.retryCount += 1;

    this.logAIOpsAudit(adminRole, adminId, "RETRY_QUEUE_JOB", `Re-enqueued failed AI job ${jobId}`, jobId);

    return { success: true, job: { ...job } };
  }

  public static async cancelQueueJob(adminRole: string, adminId: string, jobId: string) {
    if (!AdminRbacEngine.canManageSystemSettings(adminRole)) throw new Error("Forbidden.");

    const job = this.queueStore.find((j) => j.id === jobId);
    if (!job) throw new Error("Job not found.");

    job.status = "cancelled";

    this.logAIOpsAudit(adminRole, adminId, "CANCEL_QUEUE_JOB", `Cancelled AI queue job ${jobId}`, jobId);

    return { success: true, job: { ...job } };
  }

  public static async prioritizeQueueJob(adminRole: string, adminId: string, jobId: string, priority: AIJobPriority) {
    if (!AdminRbacEngine.canManageSystemSettings(adminRole)) throw new Error("Forbidden.");

    const job = this.queueStore.find((j) => j.id === jobId);
    if (!job) throw new Error("Job not found.");

    job.priority = priority;

    this.logAIOpsAudit(adminRole, adminId, "PRIORITIZE_QUEUE_JOB", `Set job ${jobId} priority to ${priority}`, jobId);

    return { success: true, job: { ...job } };
  }
}
