import { ThemeCSSVariables } from "../types";

export class ThemeRenderer {
  public static computeCSSVariables(theme: any): ThemeCSSVariables {
    const colors: any = theme?.colors || {};
    const typography: any = theme?.typography || {};
    const components: any = theme?.components || {};

    return {
      primary: colors.primary || "#3b82f6",
      secondary: colors.secondary || "#1d4ed8",
      accent: colors.accent || "#f59e0b",
      background: colors.background || "#ffffff",
      cardBg: colors.cardBg || "#f3f4f6",
      border: colors.border || "#e5e7eb",
      textPrimary: colors.textPrimary || "#1f2937",
      textSecondary: colors.textSecondary || "#4b5563",
      shadow: colors.shadow || "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      radius: components.borderRadius || "8px",
      headingsFont: typography.headingsFont || "Inter",
      bodyFont: typography.bodyFont || "Inter",
      monoFont: typography.monoFont || "Fira Code"
    };
  }

  public static toStyleObject(vars: ThemeCSSVariables): Record<string, string> {
    return {
      "--color-primary": vars.primary,
      "--color-secondary": vars.secondary,
      "--color-accent": vars.accent,
      "--color-background": vars.background,
      "--color-card-bg": vars.cardBg,
      "--color-border": vars.border,
      "--color-text-primary": vars.textPrimary,
      "--color-text-secondary": vars.textSecondary,
      "--shadow-custom": vars.shadow,
      "--radius-custom": vars.radius,
      "--font-headings": vars.headingsFont,
      "--font-body": vars.bodyFont,
      "--font-mono": vars.monoFont
    };
  }
}
