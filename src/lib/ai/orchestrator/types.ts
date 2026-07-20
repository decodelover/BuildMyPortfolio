// ─────────────────────────────────────────────────────────────────────────────
// Agent Identifiers & Statuses (Existing Backward Compatible)
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// Workflow Identifiers & Types (Step 9D Expansion)
// ─────────────────────────────────────────────────────────────────────────────

export type WorkflowType =
  | "portfolio-generation"
  | "portfolio-update"
  | "portfolio-regeneration"
  | "theme-change"
  | "seo-refresh"
  | "content-refresh";

export type TaskStatus = "pending" | "scheduled" | "running" | "completed" | "failed" | "skipped";

export interface TaskDefinition {
  id: string;
  name: string;
  agentId: AgentId;
  dependencies: string[];
  priority: number;
  timeoutMs: number;
  allowParallel: boolean;
}

export interface WorkflowDefinition {
  workflowId: WorkflowType;
  name: string;
  description: string;
  version: string;
  tasks: TaskDefinition[];
}

export interface ExecutionStage {
  stageIndex: number;
  stageName: string;
  tasks: TaskDefinition[];
  isParallel: boolean;
}

export interface ExecutionPlan {
  workflowId: WorkflowType;
  executionId: string;
  stages: ExecutionStage[];
  totalTasksCount: number;
}

export interface CheckpointData {
  checkpointId: string;
  timestamp: string;
  completedTaskIds: string[];
  outputs: Record<string, any>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Event Bus Types
// ─────────────────────────────────────────────────────────────────────────────

export type WorkflowEventType =
  | "workflow:started"
  | "stage:started"
  | "stage:completed"
  | "task:started"
  | "task:completed"
  | "task:failed"
  | "task:retrying"
  | "progress:updated"
  | "checkpoint:saved"
  | "workflow:completed"
  | "workflow:failed";

export interface WorkflowEvent {
  type: WorkflowEventType;
  workflowId: WorkflowType;
  executionId: string;
  timestamp: string;
  taskId?: string;
  agentId?: AgentId;
  progress?: number;
  message?: string;
  data?: Record<string, any>;
  error?: string;
}

export type WorkflowEventListener = (event: WorkflowEvent) => void;

// ─────────────────────────────────────────────────────────────────────────────
// Execution Metrics & Final Workflow Result
// ─────────────────────────────────────────────────────────────────────────────

export interface TaskExecutionMetric {
  taskId: string;
  agentId: AgentId;
  durationMs: number;
  attempts: number;
  status: TaskStatus;
}

export interface WorkflowExecutionMetrics {
  totalDurationMs: number;
  taskMetrics: TaskExecutionMetric[];
  parallelStagesCount: number;
  serialStagesCount: number;
  totalTokensProcessed: number;
  totalEstimatedCostUsd: number;
  peakMemoryMb: number;
}

export interface WorkflowResult {
  workflowId: WorkflowType;
  executionId: string;
  success: boolean;
  completedTasks: string[];
  skippedTasks: string[];
  warnings: string[];
  errors: string[];
  executionTimeMs: number;
  metrics: WorkflowExecutionMetrics;
  blueprint?: any;
  manifest?: WebsiteManifest;
  metadata: Record<string, any>;
  version: string;
  timestamp: string;
}
