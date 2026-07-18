export type AgentId = "content" | "design" | "seo" | "qa" | "compiler";

export type AgentStatus = "idle" | "running" | "completed" | "failed" | "skipped";

export type JobStatus = "queued" | "running" | "completed" | "failed" | "cancelled";

export interface RetryPolicy {
  maxRetries: number;
  backoffMs: number;
  retryableErrors?: string[];
}

export interface AgentConfig {
  id: AgentId;
  priority: number;
  timeoutMs: number;
  retryPolicy: RetryPolicy;
}

export interface AgentValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface AgentState {
  agentId: AgentId;
  status: AgentStatus;
  startedAt?: string | null;
  completedAt?: string | null;
  attempts: number;
  error?: string | null;
}

export interface GenerationLogEntry {
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  agentId?: AgentId;
  message: string;
  data?: Record<string, any>;
}

export interface GenerationJob {
  jobId: string;
  userId: string;
  builderId: string;
  planId: string;
  status: JobStatus;
  progress: number; // 0 to 100
  agentStates: Record<AgentId, AgentState>;
  logs: GenerationLogEntry[];
  error?: string | null;
  manifestId?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Final compiled output manifest for site renderer
export interface WebsiteManifest {
  manifestId: string;
  userId: string;
  builderId: string;
  planId: string;
  pages: Array<{
    name: string;
    slug: string;
    sections: Array<{
      id: string;
      type: string;
      title: string;
      content: Record<string, any>;
      styles: Record<string, any>;
    }>;
    seo: {
      title: string;
      description: string;
      keywords: string[];
    };
  }>;
  theme: {
    themeId: string;
    palette: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      cardBg: string;
      border: string;
      textPrimary: string;
      textSecondary: string;
    };
    typography: {
      headingsFont: string;
      bodyFont: string;
      monoFont: string;
    };
  };
  metadata: {
    compiledAt: string;
    compilerVersion: string;
    qualityScore: number;
  };
}

export interface AgentInput {
  userId: string;
  builderId: string;
  planId: string;
  websiteData: Record<string, any>;
  plan: any; // WebsiteGenerationPlan
}

export interface AgentOutput {
  agentId: AgentId;
  success: boolean;
  data: Record<string, any>;
  error?: string;
}
