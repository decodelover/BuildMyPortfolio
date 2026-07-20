export class CompilationError extends Error {
  public readonly code: string;
  public readonly details?: Record<string, any>;

  constructor(message: string, code: string = "COMPILATION_ERROR", details?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class CompilationInputError extends CompilationError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "COMPILATION_INPUT_ERROR", details);
  }
}

export class DependencyResolutionError extends CompilationError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "DEPENDENCY_RESOLUTION_ERROR", details);
  }
}

export class ConflictResolutionError extends CompilationError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "CONFLICT_RESOLUTION_ERROR", details);
  }
}

export class BlueprintValidationError extends CompilationError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "BLUEPRINT_VALIDATION_ERROR", details);
  }
}

export class CompilationPipelineError extends CompilationError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "COMPILATION_PIPELINE_ERROR", details);
  }
}

export class CompilationSecurityError extends CompilationError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "COMPILATION_SECURITY_ERROR", details);
  }
}

export class AssetCompilationError extends CompilationError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "ASSET_COMPILATION_ERROR", details);
  }
}

export class SnapshotError extends CompilationError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "SNAPSHOT_ERROR", details);
  }
}

export class VersionError extends CompilationError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "VERSION_ERROR", details);
  }
}

export class SectionCompilationError extends CompilationError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "SECTION_COMPILATION_ERROR", details);
  }
}
