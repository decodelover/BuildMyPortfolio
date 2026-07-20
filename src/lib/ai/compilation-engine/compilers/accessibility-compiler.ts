import { CompilationContext, AccessibilityBlueprint, ConflictResolution } from "../types";
import { CompilationConfig } from "../config/compilation-config";

export class AccessibilityCompiler {
  public static compile(
    context: CompilationContext,
    resolutions: ConflictResolution[]
  ): AccessibilityBlueprint {
    const design = context.designBlueprint;
    const seo = context.seoBlueprint;

    const wcagRes = resolutions.find((r) => r.field === "accessibility.wcagCompliance");
    const wcagCompliance = wcagRes ? String(wcagRes.resolvedValue) : CompilationConfig.defaultAccessibility.wcagCompliance;

    const ariaLandmarks = design?.accessibility?.keyboardNavigationHints?.ariaRolesMap || CompilationConfig.defaultAccessibility.ariaLandmarks;

    const focusOutlineStyle = design?.accessibility?.focusOutlineStyle || CompilationConfig.defaultAccessibility.focusOutlineStyle;

    const skipLinkEnabled = design?.accessibility?.keyboardNavigationHints?.supportsSkipLink ?? CompilationConfig.defaultAccessibility.skipLinkEnabled;

    const minimumContrastRatio = design?.accessibility?.minimumContrastRatio || CompilationConfig.defaultAccessibility.minimumContrastRatio;

    const minFontSize = design?.accessibility?.minFontSize || CompilationConfig.defaultAccessibility.minFontSize;

    const screenReaderCues = seo?.accessibility?.screenReaderCues || CompilationConfig.defaultAccessibility.screenReaderCues;

    return {
      wcagCompliance,
      ariaLandmarks,
      focusOutlineStyle,
      skipLinkEnabled,
      minimumContrastRatio,
      minFontSize,
      screenReaderCues,
      keyboardNavigationEnabled: true
    };
  }
}
