import { StructuredLogger } from "../logger";

export class OrchestrationLogger extends StructuredLogger {
  constructor(jobId?: string) {
    super(jobId);
  }

  public workflowStarted(workflowId: string, executionId: string): void {
    this.info(`Workflow started: '${workflowId}' (ExecutionId: ${executionId})`);
  }

  public workflowCompleted(workflowId: string, executionId: string, durationMs: number): void {
    this.info(`Workflow completed successfully: '${workflowId}' in ${durationMs}ms`, undefined, { executionId, durationMs });
  }

  public workflowFailed(workflowId: string, executionId: string, error: Error): void {
    this.error(`Workflow failed: '${workflowId}' (ExecutionId: ${executionId}). Error: ${error.message}`, undefined, { stack: error.stack });
  }

  public stageStarted(stageIndex: number, stageName: string, isParallel: boolean): void {
    this.info(`Stage ${stageIndex + 1} started: '${stageName}' (Parallel: ${isParallel})`);
  }

  public stageCompleted(stageIndex: number, stageName: string, durationMs: number): void {
    this.info(`Stage ${stageIndex + 1} completed: '${stageName}' in ${durationMs}ms`);
  }

  public taskStarted(taskId: string, agentId: string): void {
    this.info(`Task started: '${taskId}' (Agent: ${agentId})`);
  }

  public taskCompleted(taskId: string, durationMs: number): void {
    this.info(`Task completed: '${taskId}' in ${durationMs}ms`);
  }

  public taskFailed(taskId: string, error: Error): void {
    this.error(`Task failed: '${taskId}'. Error: ${error.message}`);
  }

  public checkpointSaved(checkpointId: string, completedTasksCount: number): void {
    this.info(`Checkpoint saved: '${checkpointId}' (${completedTasksCount} tasks completed)`);
  }
}
