export class ContentAgentError extends Error {
  public readonly code: string;
  public readonly details?: Record<string, any>;

  constructor(message: string, code: string = "CONTENT_AGENT_ERROR", details?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InputValidationError extends ContentAgentError {
  constructor(message: string, issues: any[]) {
    super(message, "INPUT_VALIDATION_ERROR", { issues });
  }
}

export class DataNormalizationError extends ContentAgentError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "DATA_NORMALIZATION_ERROR", details);
  }
}

export class TaskGenerationError extends ContentAgentError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "TASK_GENERATION_ERROR", details);
  }
}

export class TaskExecutionError extends ContentAgentError {
  constructor(message: string, taskId: string) {
    super(message, "TASK_EXECUTION_ERROR", { taskId });
  }
}

export class PipelineError extends ContentAgentError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "PIPELINE_ERROR", details);
  }
}

export class ProviderError extends ContentAgentError {
  constructor(message: string, providerId: string) {
    super(message, "PROVIDER_ERROR", { providerId });
  }
}

export class SecurityViolationError extends ContentAgentError {
  constructor(message: string) {
    super(message, "SECURITY_VIOLATION_ERROR");
  }
}
