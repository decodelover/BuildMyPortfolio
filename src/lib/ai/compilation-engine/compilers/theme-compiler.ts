import { CompilationContext, ThemeBlueprint, ConflictResolution } from "../types";
import { CompilationConfig } from "../config/compilation-config";

export class ThemeCompiler {
  public static compile(
    context: CompilationContext,
    resolutions: ConflictResolution[]
  ): ThemeBlueprint {
    const design = context.designBlueprint;
    const rawInput = context.rawInput || {};
    const prefs = rawInput.websitePreferences || {};

    // 1. Resolve selected theme ID from conflicts
    const themeIdRes = resolutions.find((r) => r.field === "theme.themeId");
    const themeId = themeIdRes ? String(themeIdRes.resolvedValue) : "modern";

    // 2. Resolve colors
    const designColors = (design?.theme?.colors || {}) as Record<string, any>;
    const colors = {
      primary: designColors.primary || CompilationConfig.defaultThemePalette.primary,
      secondary: designColors.secondary || CompilationConfig.defaultThemePalette.secondary,
      accent: designColors.accent || CompilationConfig.defaultThemePalette.accent,
      background: designColors.background || CompilationConfig.defaultThemePalette.background,
      cardBg: designColors.cardBg || CompilationConfig.defaultThemePalette.cardBg,
      border: designColors.border || CompilationConfig.defaultThemePalette.border,
      textPrimary: designColors.textPrimary || CompilationConfig.defaultThemePalette.textPrimary,
      textSecondary: designColors.textSecondary || CompilationConfig.defaultThemePalette.textSecondary,
      shadow: designColors.shadow || CompilationConfig.defaultThemePalette.shadow
    };

    // Override with any direct user palette inputs from wizard plan config if they exist
    const planPalette = context.rawInput?.websitePreferences?.palette || {};
    if (planPalette.primary) colors.primary = planPalette.primary;
    if (planPalette.secondary) colors.secondary = planPalette.secondary;
    if (planPalette.accent) colors.accent = planPalette.accent;

    // 3. Resolve typography
    const designTypography = (design?.theme?.typography || {}) as Record<string, any>;
    const typography = {
      headingsFont: designTypography.headingsFont || CompilationConfig.defaultTypography.headingsFont,
      bodyFont: designTypography.bodyFont || CompilationConfig.defaultTypography.bodyFont,
      monoFont: designTypography.monoFont || CompilationConfig.defaultTypography.monoFont,
      headingScale: designTypography.headingScale || CompilationConfig.defaultTypography.headingScale,
      baseFontSize: designTypography.baseFontSize || CompilationConfig.defaultTypography.baseFontSize,
      lineHeightBase: designTypography.lineHeightBase || CompilationConfig.defaultTypography.lineHeightBase,
      fontWeightHeading: designTypography.fontWeightHeading || CompilationConfig.defaultTypography.fontWeightHeading,
      fontWeightBody: designTypography.fontWeightBody || CompilationConfig.defaultTypography.fontWeightBody
    };

    // Override with any user typography wizard choices
    const userTypo = context.rawInput?.websitePreferences?.typography || {};
    if (userTypo.headingsFont) typography.headingsFont = userTypo.headingsFont;
    if (userTypo.bodyFont) typography.bodyFont = userTypo.bodyFont;

    // 4. Spacing
    const designSpacing = (design?.theme?.spacing || {}) as Record<string, any>;
    const spacing = {
      sectionPadding: designSpacing.sectionPadding || CompilationConfig.defaultSpacing.sectionPadding,
      containerMaxWidth: designSpacing.containerMaxWidth || CompilationConfig.defaultSpacing.containerMaxWidth,
      gridGap: designSpacing.gridGap || CompilationConfig.defaultSpacing.gridGap,
      itemSpacing: designSpacing.itemSpacing || CompilationConfig.defaultSpacing.itemSpacing
    };

    // 5. Components borderRadius resolved
    const borderRadiusRes = resolutions.find((r) => r.field === "theme.components.borderRadius");
    const borderRadius = borderRadiusRes ? String(borderRadiusRes.resolvedValue) : "8px";

    const components = {
      borderRadius,
      elevation: design?.theme?.components?.elevation || {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg"
      },
      cardStyle: design?.theme?.components?.cardStyle || {
        borderWidth: "1px",
        borderColor: "border-border"
      },
      buttonStyle: design?.theme?.components?.buttonStyle || {
        padding: "px-6 py-2.5",
        fontWeight: "font-semibold",
        shadow: "shadow-sm",
        hoverEffect: "hover:scale-102 hover:shadow"
      },
      inputStyle: design?.theme?.components?.inputStyle || {
        padding: "px-4 py-2",
        bg: "bg-background",
        border: "border-border",
        focusRing: "focus:ring-2 focus:ring-primary/20 focus:border-primary"
      }
    };

    const isDark = design?.theme?.isDark || themeId.includes("dark");

    return {
      themeId,
      colors,
      typography,
      spacing,
      components,
      responsive: design?.theme?.responsive || {},
      animations: design?.animations || {},
      accessibility: design?.accessibility || {},
      isDark
    };
  }
}
