export class OrchestrationError extends Error {
  public readonly code: string;
  public readonly details?: Record<string, any>;

  constructor(message: string, code: string = "ORCHESTRATION_ERROR", details?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class WorkflowNotFoundError extends OrchestrationError {
  constructor(workflowId: string) {
    super(`Workflow '${workflowId}' is not registered in WorkflowRegistry.`, "WORKFLOW_NOT_FOUND", { workflowId });
  }
}

export class CircularDependencyError extends OrchestrationError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "CIRCULAR_DEPENDENCY_ERROR", details);
  }
}

export class TaskExecutionError extends OrchestrationError {
  constructor(taskId: string, message: string, details?: Record<string, any>) {
    super(`Execution of task '${taskId}' failed: ${message}`, "TASK_EXECUTION_ERROR", { taskId, ...details });
  }
}

export class WorkflowTimeoutError extends OrchestrationError {
  constructor(workflowId: string, durationMs: number) {
    super(`Workflow '${workflowId}' timed out after ${durationMs}ms.`, "WORKFLOW_TIMEOUT_ERROR", { workflowId, durationMs });
  }
}

export class CheckpointRestoreError extends OrchestrationError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "CHECKPOINT_RESTORE_ERROR", details);
  }
}
