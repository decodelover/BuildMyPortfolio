import { StructuredLogger } from "../../orchestrator/logger";
import { ValidationIssue } from "../types";

export class ContentAgentLogger extends StructuredLogger {
  constructor(jobId?: string) {
    super(jobId);
  }

  public pipelineStarted(): void {
    this.info("Content Pipeline execution started.", "content");
  }

  public pipelineCompleted(metadata: Record<string, any>): void {
    this.info("Content Pipeline execution finished successfully.", "content", metadata);
  }

  public pipelineFailed(error: Error): void {
    this.error(`Content Pipeline execution failed: ${error.message}`, "content", { stack: error.stack });
  }

  public taskStarted(taskId: string, taskType: string): void {
    this.info(`Starting execution of content task: '${taskType}'`, "content", { taskId });
  }

  public taskCompleted(taskId: string, taskType: string): void {
    this.info(`Successfully completed content task: '${taskType}'`, "content", { taskId });
  }

  public taskFailed(taskId: string, taskType: string, error: Error): void {
    this.error(`Content task '${taskType}' execution failed: ${error.message}`, "content", { taskId, error: error.message });
  }

  public validationError(issues: ValidationIssue[]): void {
    this.warn("Input validation failed with blocking issues.", "content", { issuesCount: issues.length, issues });
  }
}
