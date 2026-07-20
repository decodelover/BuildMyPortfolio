import { RenderContext } from "../types";

export class RenderingValidators {
  public static validateRenderContext(context: RenderContext): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!context.renderId) errors.push("Render ID is missing.");
    if (!context.blueprintId) errors.push("Blueprint ID is missing.");
    if (!context.userId) errors.push("User ID is missing.");
    if (!context.builderId) errors.push("Builder ID is missing.");
    if (!context.theme) errors.push("Theme blueprint configuration is missing.");
    if (!context.cssVariables || !context.cssVariables.primary) errors.push("CSS variables mapping is incomplete.");
    if (!context.sections || context.sections.length === 0) errors.push("No sections available to render.");

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
