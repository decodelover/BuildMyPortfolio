export class AIProviderError extends Error {
  public readonly code: string;
  public readonly provider?: string;
  public readonly details?: Record<string, any>;

  constructor(message: string, code: string = "AI_PROVIDER_ERROR", provider?: string, details?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.provider = provider;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AITimeoutError extends AIProviderError {
  constructor(message: string = "AI request timed out.", provider?: string, details?: Record<string, any>) {
    super(message, "AI_TIMEOUT_ERROR", provider, details);
  }
}

export class AIRateLimitError extends AIProviderError {
  constructor(message: string = "AI provider rate limit exceeded.", provider?: string, details?: Record<string, any>) {
    super(message, "AI_RATE_LIMIT_ERROR", provider, details);
  }
}

export class AISafetyError extends AIProviderError {
  constructor(message: string = "AI prompt or response failed safety validation.", provider?: string, details?: Record<string, any>) {
    super(message, "AI_SAFETY_ERROR", provider, details);
  }
}

export class AIResponseParsingError extends AIProviderError {
  constructor(message: string = "Failed to parse structured response from AI model.", provider?: string, details?: Record<string, any>) {
    super(message, "AI_RESPONSE_PARSING_ERROR", provider, details);
  }
}

export class AIProviderUnavailableError extends AIProviderError {
  constructor(message: string = "Specified AI provider is unavailable or unconfigured.", provider?: string, details?: Record<string, any>) {
    super(message, "AI_PROVIDER_UNAVAILABLE", provider, details);
  }
}

export class AITokenLimitExceededError extends AIProviderError {
  constructor(message: string = "Token limit exceeded for requested model context window.", provider?: string, details?: Record<string, any>) {
    super(message, "AI_TOKEN_LIMIT_EXCEEDED", provider, details);
  }
}
