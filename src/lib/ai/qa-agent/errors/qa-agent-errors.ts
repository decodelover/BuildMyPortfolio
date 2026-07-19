export class QaAgentError extends Error {
  public readonly code: string;
  public readonly details?: Record<string, any>;

  constructor(message: string, code: string = "QA_AGENT_ERROR", details?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class QaInputError extends QaAgentError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "QA_INPUT_ERROR", details);
  }
}

export class QaValidationError extends QaAgentError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "QA_VALIDATION_ERROR", details);
  }
}

export class QaPipelineError extends QaAgentError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "QA_PIPELINE_ERROR", details);
  }
}

export class QaSecurityError extends QaAgentError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "QA_SECURITY_ERROR", details);
  }
}
