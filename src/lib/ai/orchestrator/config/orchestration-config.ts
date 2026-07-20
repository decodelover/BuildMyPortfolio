import { WorkflowType } from "../types";

export class OrchestrationConfig {
  public static readonly defaultWorkflow: WorkflowType = "portfolio-generation";
  public static readonly engineVersion = "1.0.0";

  public static readonly limits = {
    maxParallelTasks: 4,
    defaultTaskTimeoutMs: 60000,
    maxWorkflowTimeoutMs: 300000,
    maxTaskRetries: 3,
    backoffMs: 1000
  };

  public static readonly retryPolicy = {
    maxRetries: 3,
    backoffMs: 1000,
    retryableErrors: [
      "AI_RATE_LIMIT_ERROR",
      "AI_TIMEOUT_ERROR",
      "NETWORK_ERROR",
      "FETCH_ERROR"
    ]
  };

  public static readonly checkpointRetentionCount = 5;
}
