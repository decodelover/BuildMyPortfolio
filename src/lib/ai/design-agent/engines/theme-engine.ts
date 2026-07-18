import { ThemeTokens, DesignThemeId, DesignContext, ColorTokens } from "../types";
import { ThemeResolutionError } from "../errors/design-agent-errors";
import { DesignSanitizer } from "../security/design-sanitizer";

export class ThemeEngine {
  
  public static resolve(context: DesignContext): ThemeTokens {
    const themeId = this.normalizeThemeId(context.themePreference);
    const colors = this.resolveColorPalette(themeId, context.colorPalettePreference);
    
    // Validate all resolved colors to prevent malicious theme values
    Object.entries(colors).forEach(([key, val]) => {
      DesignSanitizer.validateColor(val, key);
    });

    const isDark = ["dark-developer", "glassmorphism", "creative"].includes(themeId);
    
    // Spacing configuration templates
    const spacing = {
      sectionPadding: "py-20 lg:py-32",
      containerMaxWidth: "max-w-7xl",
      gridGap: "gap-8",
      itemSpacing: "space-y-6"
    };

    // Typography templates
    const typography = this.resolveTypography(themeId, context.fontPreference);

    // Component styles templates
    const components = this.resolveComponentStyles(themeId, context.borderRadiusPreference);

    // Responsive scaling configuration templates
    const responsive = {
      breakpoints: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px"
      },
      typographyScaling: {
        mobileMultiplier: 0.85,
        tabletMultiplier: 0.95,
        desktopMultiplier: 1.0
      },
      sectionSpacingScaling: {
        mobile: "py-12",
        tablet: "py-16",
        desktop: "py-24"
      }
    };

    return {
      themeId,
      colors,
      typography,
      spacing,
      components,
      responsive,
      isDark
    };
  }

  private static normalizeThemeId(pref: string): DesignThemeId {
    const norm = pref.toLowerCase().trim();
    if (norm.includes("minimal")) return "minimal";
    if (norm.includes("executive")) return "executive";
    if (norm.includes("corporate")) return "corporate";
    if (norm.includes("creative")) return "creative";
    if (norm.includes("startup")) return "startup";
    if (norm.includes("developer") || norm.includes("dark-developer")) return "dark-developer";
    if (norm.includes("glass")) return "glassmorphism";
    return "modern"; // fallback
  }

  private static resolveColorPalette(themeId: DesignThemeId, colorPalettePref?: string): ColorTokens {
    const pref = (colorPalettePref || "").toLowerCase();

    // Default themes tokens map
    const themePalettes: Record<DesignThemeId, ColorTokens> = {
      modern: {
        primary: "#6366f1", // Indigo 500
        secondary: "#4f46e5", // Indigo 600
        accent: "#f59e0b", // Amber 500
        background: "#fafafa", // Zinc 50
        cardBg: "#ffffff",
        border: "#e4e4e7", // Zinc 200
        textPrimary: "#09090b", // Zinc 950
        textSecondary: "#71717a", // Zinc 500
        shadow: "rgba(0, 0, 0, 0.05)"
      },
      minimal: {
        primary: "#18181b", // Zinc 900
        secondary: "#27272a", // Zinc 800
        accent: "#3f3f46", // Zinc 700
        background: "#ffffff",
        cardBg: "#f4f4f5", // Zinc 100
        border: "#e4e4e7",
        textPrimary: "#09090b",
        textSecondary: "#52525b",
        shadow: "rgba(0, 0, 0, 0.01)"
      },
      executive: {
        primary: "#0f172a", // Slate 900
        secondary: "#1e293b", // Slate 800
        accent: "#b45309", // Amber 700 / Gold
        background: "#f8fafc",
        cardBg: "#ffffff",
        border: "#cbd5e1",
        textPrimary: "#0f172a",
        textSecondary: "#475569",
        shadow: "rgba(15, 23, 42, 0.08)"
      },
      corporate: {
        primary: "#1e3a8a", // Blue 900
        secondary: "#3b82f6", // Blue 500
        accent: "#f59e0b",
        background: "#ffffff",
        cardBg: "#f8fafc",
        border: "#e2e8f0",
        textPrimary: "#0f172a",
        textSecondary: "#475569",
        shadow: "rgba(30, 58, 138, 0.05)"
      },
      creative: {
        primary: "#d946ef", // Fuchsia 500
        secondary: "#ec4899", // Pink 500
        accent: "#f43f5e", // Rose 500
        background: "#0b051e", // Midnight Indigo
        cardBg: "#160e36",
        border: "#29195c",
        textPrimary: "#fafafa",
        textSecondary: "#b8a8e3",
        shadow: "rgba(217, 70, 239, 0.15)"
      },
      startup: {
        primary: "#2563eb", // Blue 600
        secondary: "#10b981", // Emerald 500
        accent: "#06b6d4", // Cyan 500
        background: "#f8fafc",
        cardBg: "#ffffff",
        border: "#e2e8f0",
        textPrimary: "#0f172a",
        textSecondary: "#64748b",
        shadow: "rgba(37, 99, 235, 0.04)"
      },
      "dark-developer": {
        primary: "#10b981", // Emerald 500
        secondary: "#047857", // Emerald 700
        accent: "#06b6d4", // Cyan 500
        background: "#0f172a", // Slate 900
        cardBg: "#1e293b", // Slate 800
        border: "#334155", // Slate 700
        textPrimary: "#f8fafc",
        textSecondary: "#94a3b8",
        shadow: "rgba(0, 0, 0, 0.3)"
      },
      glassmorphism: {
        primary: "#ffffff",
        secondary: "#e2e8f0",
        accent: "#38bdf8",
        background: "#0f172a", // dark bg is needed for backdrop blur to look premium
        cardBg: "rgba(255, 255, 255, 0.03)",
        border: "rgba(255, 255, 255, 0.08)",
        textPrimary: "#f8fafc",
        textSecondary: "#94a3b8",
        shadow: "rgba(0, 0, 0, 0.2)"
      }
    };

    const colors = { ...themePalettes[themeId] };

    // Apply color preference overrides if matched
    if (pref.includes("green") || pref.includes("emerald")) {
      colors.primary = "#10b981";
      colors.secondary = "#047857";
      colors.accent = "#06b6d4";
    } else if (pref.includes("ocean") || pref.includes("blue")) {
      colors.primary = "#2563eb";
      colors.secondary = "#1d4ed8";
      colors.accent = "#38bdf8";
    } else if (pref.includes("neon") || pref.includes("violet") || pref.includes("purple")) {
      colors.primary = "#8b5cf6";
      colors.secondary = "#7c3aed";
      colors.accent = "#d946ef";
    } else if (pref.includes("sunset") || pref.includes("orange") || pref.includes("red")) {
      colors.primary = "#ea580c";
      colors.secondary = "#c2410c";
      colors.accent = "#f59e0b";
    } else if (pref.includes("monochrome") || pref.includes("black")) {
      colors.primary = "#18181b";
      colors.secondary = "#27272a";
      colors.accent = "#52525b";
    }

    return colors;
  }

  private static resolveTypography(themeId: DesignThemeId, fontPref?: string): ThemeTokens["typography"] {
    const norm = (fontPref || "").toLowerCase();
    
    // Default config sets based on theme ID
    const typographyDefaults: Record<DesignThemeId, ThemeTokens["typography"]> = {
      modern: {
        headingsFont: "Outfit, sans-serif",
        bodyFont: "Inter, sans-serif",
        monoFont: "Fira Code, monospace",
        headingScale: "major-third",
        baseFontSize: "16px",
        lineHeightBase: "1.6",
        fontWeightHeading: "700",
        fontWeightBody: "400"
      },
      minimal: {
        headingsFont: "Inter, sans-serif",
        bodyFont: "Inter, sans-serif",
        monoFont: "Fira Code, monospace",
        headingScale: "minor-third",
        baseFontSize: "15px",
        lineHeightBase: "1.5",
        fontWeightHeading: "600",
        fontWeightBody: "400"
      },
      executive: {
        headingsFont: "Playfair Display, Georgia, serif",
        bodyFont: "Inter, sans-serif",
        monoFont: "Courier New, monospace",
        headingScale: "perfect-fifth",
        baseFontSize: "16px",
        lineHeightBase: "1.6",
        fontWeightHeading: "700",
        fontWeightBody: "400"
      },
      corporate: {
        headingsFont: "Inter, sans-serif",
        bodyFont: "Roboto, sans-serif",
        monoFont: "Courier New, monospace",
        headingScale: "minor-third",
        baseFontSize: "16px",
        lineHeightBase: "1.55",
        fontWeightHeading: "700",
        fontWeightBody: "400"
      },
      creative: {
        headingsFont: "Outfit, sans-serif",
        bodyFont: "Outfit, sans-serif",
        monoFont: "Fira Code, monospace",
        headingScale: "perfect-fourth",
        baseFontSize: "16px",
        lineHeightBase: "1.65",
        fontWeightHeading: "800",
        fontWeightBody: "400"
      },
      startup: {
        headingsFont: "Outfit, sans-serif",
        bodyFont: "Inter, sans-serif",
        monoFont: "Fira Code, monospace",
        headingScale: "major-third",
        baseFontSize: "16px",
        lineHeightBase: "1.6",
        fontWeightHeading: "700",
        fontWeightBody: "400"
      },
      "dark-developer": {
        headingsFont: "Fira Code, monospace",
        bodyFont: "Inter, sans-serif",
        monoFont: "Fira Code, monospace",
        headingScale: "major-second",
        baseFontSize: "15px",
        lineHeightBase: "1.5",
        fontWeightHeading: "700",
        fontWeightBody: "400"
      },
      glassmorphism: {
        headingsFont: "Outfit, sans-serif",
        bodyFont: "Inter, sans-serif",
        monoFont: "Fira Code, monospace",
        headingScale: "major-third",
        baseFontSize: "16px",
        lineHeightBase: "1.6",
        fontWeightHeading: "700",
        fontWeightBody: "300"
      }
    };

    const typography = { ...typographyDefaults[themeId] };

    // Apply explicit font overrides
    if (norm.includes("serif") || norm.includes("playfair")) {
      typography.headingsFont = "Playfair Display, Georgia, serif";
    } else if (norm.includes("mono") || norm.includes("fira")) {
      typography.headingsFont = "Fira Code, monospace";
      typography.bodyFont = "Fira Code, monospace";
    } else if (norm.includes("outfit") || norm.includes("modern")) {
      typography.headingsFont = "Outfit, sans-serif";
      typography.bodyFont = "Outfit, sans-serif";
    } else if (norm.includes("inter") || norm.includes("sans")) {
      typography.headingsFont = "Inter, sans-serif";
      typography.bodyFont = "Inter, sans-serif";
    }

    return typography;
  }

  private static resolveComponentStyles(themeId: DesignThemeId, borderRadiusPref?: string): ThemeTokens["components"] {
    let resolvedRadius = "8px"; // default medium
    
    if (borderRadiusPref) {
      const norm = borderRadiusPref.toLowerCase();
      if (norm.includes("none")) resolvedRadius = "0px";
      else if (norm.includes("small") || norm.includes("4px")) resolvedRadius = "4px";
      else if (norm.includes("medium") || norm.includes("8px")) resolvedRadius = "8px";
      else if (norm.includes("large") || norm.includes("16px")) resolvedRadius = "16px";
      else if (norm.includes("full") || norm.includes("round")) resolvedRadius = "9999px";
    } else {
      // Theme specific defaults
      if (themeId === "minimal") resolvedRadius = "0px";
      if (themeId === "creative" || themeId === "glassmorphism") resolvedRadius = "16px";
    }

    return {
      borderRadius: resolvedRadius,
      elevation: {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg"
      },
      cardStyle: {
        borderWidth: themeId === "glassmorphism" ? "1px" : "0px",
        borderColor: themeId === "glassmorphism" ? "rgba(255, 255, 255, 0.08)" : "transparent",
        backdropBlur: themeId === "glassmorphism" ? "backdrop-blur-md" : undefined,
        bgOpacity: themeId === "glassmorphism" ? 0.03 : 1
      },
      buttonStyle: {
        padding: "px-6 py-3",
        borderRadius: resolvedRadius,
        fontWeight: "font-semibold",
        shadow: themeId === "minimal" ? "shadow-none" : "shadow-sm",
        hoverEffect: "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      },
      inputStyle: {
        padding: "px-4 py-2",
        borderRadius: resolvedRadius,
        bg: themeId === "glassmorphism" ? "rgba(255, 255, 255, 0.05)" : "#ffffff",
        border: "border border-zinc-300",
        focusRing: "focus:ring-2 focus:ring-primary focus:border-transparent"
      }
    };
  }
}
