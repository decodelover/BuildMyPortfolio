export class RenderingError extends Error {
  public readonly code: string;
  public readonly details?: Record<string, any>;

  constructor(message: string, code: string = "RENDERING_ERROR", details?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BlueprintParsingError extends RenderingError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "BLUEPRINT_PARSING_ERROR", details);
  }
}

export class SectionRenderingError extends RenderingError {
  constructor(sectionId: string, message: string, details?: Record<string, any>) {
    super(`Failed to render section '${sectionId}': ${message}`, "SECTION_RENDERING_ERROR", { sectionId, ...details });
  }
}

export class ThemeResolutionError extends RenderingError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "THEME_RESOLUTION_ERROR", details);
  }
}
