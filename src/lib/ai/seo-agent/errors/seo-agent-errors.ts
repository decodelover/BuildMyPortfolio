export class SeoAgentError extends Error {
  public readonly code: string;
  public readonly details?: Record<string, any>;

  constructor(message: string, code: string = "SEO_AGENT_ERROR", details?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class SeoInputError extends SeoAgentError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "SEO_INPUT_ERROR", details);
  }
}

export class MetadataGenerationError extends SeoAgentError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "METADATA_GENERATION_ERROR", details);
  }
}

export class SchemaGenerationError extends SeoAgentError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "SCHEMA_GENERATION_ERROR", details);
  }
}

export class SeoPipelineError extends SeoAgentError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "SEO_PIPELINE_ERROR", details);
  }
}

export class SeoSecurityError extends SeoAgentError {
  constructor(message: string) {
    super(message, "SEO_SECURITY_ERROR");
  }
}
