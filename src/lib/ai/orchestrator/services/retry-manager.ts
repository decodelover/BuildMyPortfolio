import { OrchestrationConfig } from "../config/orchestration-config";
import { OrchestrationLogger } from "../logging/orchestration-logger";
import { WorkflowEventBus } from "../events/workflow-event-bus";
import { WorkflowType } from "../types";

export class OrchestrationRetryManager {
  public static async executeWithRetry<T>(
    fn: () => Promise<T>,
    taskId: string,
    workflowId: WorkflowType,
    executionId: string,
    maxRetries: number = OrchestrationConfig.limits.maxTaskRetries,
    logger?: OrchestrationLogger,
    eventBus?: WorkflowEventBus
  ): Promise<T> {
    let attempt = 0;
    let lastError: any = null;

    while (attempt < maxRetries) {
      attempt++;
      try {
        return await fn();
      } catch (err: any) {
        lastError = err;
        if (attempt >= maxRetries) {
          throw err;
        }

        const delayMs = OrchestrationConfig.limits.backoffMs * Math.pow(2, attempt - 1);

        if (eventBus) {
          eventBus.emit({
            type: "task:retrying",
            workflowId,
            executionId,
            timestamp: new Date().toISOString(),
            taskId,
            message: `Retrying task '${taskId}' (Attempt ${attempt}/${maxRetries}) in ${delayMs}ms`
          });
        }

        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    throw lastError;
  }
}
