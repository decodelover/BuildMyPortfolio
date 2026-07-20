import { ExecutionContext } from "../context/execution-context";
import { CheckpointData } from "../types";
import { OrchestrationLogger } from "../logging/orchestration-logger";
import { WorkflowEventBus } from "../events/workflow-event-bus";

export class ErrorRecoveryManager {
  public static saveCheckpoint(
    context: ExecutionContext,
    completedTaskIds: string[],
    logger?: OrchestrationLogger,
    eventBus?: WorkflowEventBus
  ): CheckpointData {
    const checkpointId = `chk-${context.planId}-${Date.now()}`;
    const checkpoint = context.saveCheckpoint(checkpointId, completedTaskIds);

    if (logger) logger.checkpointSaved(checkpointId, completedTaskIds.length);
    if (eventBus) {
      eventBus.emit({
        type: "checkpoint:saved",
        workflowId: "portfolio-generation",
        executionId: context.executionId,
        timestamp: new Date().toISOString(),
        data: { checkpointId, completedTaskIds }
      });
    }

    return checkpoint;
  }

  public static canResumeFromCheckpoint(context: ExecutionContext): boolean {
    const latest = context.getLatestCheckpoint();
    return Boolean(latest && latest.completedTaskIds.length > 0);
  }

  public static getCompletedTasksFromCheckpoint(context: ExecutionContext): Set<string> {
    const latest = context.getLatestCheckpoint();
    return new Set(latest ? latest.completedTaskIds : []);
  }
}
