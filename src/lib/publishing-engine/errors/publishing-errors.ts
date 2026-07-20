export class PublishingError extends Error {
  public readonly code: string;
  public readonly details?: Record<string, any>;

  constructor(message: string, code: string = "PUBLISHING_ERROR", details?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BuildValidationError extends PublishingError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "BUILD_VALIDATION_ERROR", details);
  }
}

export class DeploymentError extends PublishingError {
  constructor(platform: string, message: string, details?: Record<string, any>) {
    super(`Deployment to '${platform}' failed: ${message}`, "DEPLOYMENT_ERROR", { platform, ...details });
  }
}

export class DomainVerificationError extends PublishingError {
  constructor(domain: string, message: string, details?: Record<string, any>) {
    super(`Domain verification for '${domain}' failed: ${message}`, "DOMAIN_VERIFICATION_ERROR", { domain, ...details });
  }
}

export class RollbackError extends PublishingError {
  constructor(targetVersion: string, message: string, details?: Record<string, any>) {
    super(`Rollback to version '${targetVersion}' failed: ${message}`, "ROLLBACK_ERROR", { targetVersion, ...details });
  }
}
