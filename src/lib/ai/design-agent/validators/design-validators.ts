import { DesignBlueprint } from "../types";
import { DesignInputError } from "../errors/design-agent-errors";

export class DesignValidators {
  
  public static validateBlueprint(blueprint: DesignBlueprint): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 1. Verify theme structure presence
    if (!blueprint.theme || !blueprint.theme.themeId) {
      errors.push("Design theme token mapping is missing.");
    }

    // 2. Validate section layouts
    if (!blueprint.layouts || blueprint.layouts.length === 0) {
      errors.push("No section layout rules resolved.");
    } else {
      const hasHero = blueprint.layouts.some((l) => l.type === "hero");
      if (!hasHero) {
        errors.push("Hero section layout decision is required.");
      }
    }

    // 3. Validate components match resolved layouts
    if (!blueprint.components || blueprint.components.length === 0) {
      errors.push("Component selections are empty.");
    } else if (blueprint.layouts && blueprint.components.length !== blueprint.layouts.length) {
      errors.push("Component selections mismatch layout decisions length.");
    }

    // 4. Validate accessibility contrast tokens
    if (!blueprint.accessibility?.minimumContrastRatio?.normalText) {
      errors.push("Accessibility contrast targets are missing.");
    }

    // 5. Verify animation structure setup
    if (!blueprint.animations || !blueprint.animations.motionIntensity) {
      errors.push("Animation strategies are not resolved.");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
