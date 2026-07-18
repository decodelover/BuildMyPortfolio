export class DesignAgentError extends Error {
  public readonly code: string;
  public readonly details?: Record<string, any>;

  constructor(message: string, code: string = "DESIGN_AGENT_ERROR", details?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DesignInputError extends DesignAgentError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "DESIGN_INPUT_ERROR", details);
  }
}

export class ThemeResolutionError extends DesignAgentError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "THEME_RESOLUTION_ERROR", details);
  }
}

export class LayoutResolutionError extends DesignAgentError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "LAYOUT_RESOLUTION_ERROR", details);
  }
}

export class ComponentResolutionError extends DesignAgentError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "COMPONENT_RESOLUTION_ERROR", details);
  }
}

export class AnimationResolutionError extends DesignAgentError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "ANIMATION_RESOLUTION_ERROR", details);
  }
}

export class ResponsiveResolutionError extends DesignAgentError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "RESPONSIVE_RESOLUTION_ERROR", details);
  }
}

export class AccessibilityError extends DesignAgentError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "ACCESSIBILITY_ERROR", details);
  }
}

export class ScoringError extends DesignAgentError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "SCORING_ERROR", details);
  }
}

export class DesignPipelineError extends DesignAgentError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "DESIGN_PIPELINE_ERROR", details);
  }
}

export class DesignSecurityError extends DesignAgentError {
  constructor(message: string) {
    super(message, "DESIGN_SECURITY_ERROR");
  }
}
