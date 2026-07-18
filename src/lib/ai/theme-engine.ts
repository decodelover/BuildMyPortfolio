import { ColorPalette, TypographyConfig, BrandingConfig } from "./architect-types";

// Supported themes in the system
export const VALID_THEMES = [
  "minimal",
  "developer",
  "creative",
  "corporate",
  "agency",
  "startup",
  "luxury",
  "enterprise"
] as const;

export type ThemeId = typeof VALID_THEMES[number];

/**
 * Deterministically resolves the optimal theme ID based on user preferences and profession.
 */
export function resolveTheme(profession: string, userThemePreference?: string): ThemeId {
  const normPref = userThemePreference?.toLowerCase().trim();
  
  // If the user selected a valid theme, respect it
  if (normPref && VALID_THEMES.includes(normPref as ThemeId)) {
    return normPref as ThemeId;
  }

  // Fallback to profession-based heuristics
  const normProf = profession.toLowerCase();

  if (
    normProf.includes("developer") ||
    normProf.includes("engineer") ||
    normProf.includes("coder") ||
    normProf.includes("programmer") ||
    normProf.includes("sysadmin") ||
    normProf.includes("devops") ||
    normProf.includes("architect") ||
    normProf.includes("security")
  ) {
    return "developer";
  }

  if (
    normProf.includes("designer") ||
    normProf.includes("artist") ||
    normProf.includes("ui") ||
    normProf.includes("ux") ||
    normProf.includes("illustrator") ||
    normProf.includes("creative") ||
    normProf.includes("photographer")
  ) {
    return "creative";
  }

  if (
    normProf.includes("consultant") ||
    normProf.includes("adviser") ||
    normProf.includes("advisor") ||
    normProf.includes("finance") ||
    normProf.includes("corporate") ||
    normProf.includes("business") ||
    normProf.includes("executive") ||
    normProf.includes("analyst")
  ) {
    return "corporate";
  }

  if (
    normProf.includes("agency") ||
    normProf.includes("studio") ||
    normProf.includes("copywriter") ||
    normProf.includes("marketing") ||
    normProf.includes("growth") ||
    normProf.includes("content")
  ) {
    return "agency";
  }

  if (
    normProf.includes("founder") ||
    normProf.includes("co-founder") ||
    normProf.includes("entrepreneur") ||
    normProf.includes("startup") ||
    normProf.includes("product manager") ||
    normProf.includes("pm")
  ) {
    return "startup";
  }

  if (
    normProf.includes("luxury") ||
    normProf.includes("elegant") ||
    normProf.includes("fashion") ||
    normProf.includes("premium")
  ) {
    return "luxury";
  }

  return "minimal";
}

/**
 * Returns a concrete hex color palette map derived from the theme and user palette preference.
 */
export function resolveColorPalette(themeId: ThemeId, colorPalettePref?: string): ColorPalette {
  const normalizedPref = colorPalettePref?.toLowerCase() || "";

  // 1. Theme-specific default palettes
  const defaultPalettes: Record<ThemeId, ColorPalette> = {
    minimal: {
      primary: "#18181b",      // Slate 900
      secondary: "#71717a",    // Zinc 500
      accent: "#2563eb",       // Blue 600
      background: "#fafafa",   // Slate 50
      cardBg: "#ffffff",
      border: "#e4e4e7",       // Zinc 200
      textPrimary: "#09090b",  // Zinc 950
      textSecondary: "#52525b" // Zinc 600
    },
    developer: {
      primary: "#10b981",      // Emerald 500
      secondary: "#64748b",    // Slate 500
      accent: "#06b6d4",       // Cyan 500
      background: "#0f172a",   // Slate 900
      cardBg: "#1e293b",       // Slate 800
      border: "#334155",       // Slate 700
      textPrimary: "#f8fafc",  // Slate 50
      textSecondary: "#94a3b8" // Slate 400
    },
    creative: {
      primary: "#ec4899",      // Pink 500
      secondary: "#8b5cf6",    // Violet 500
      accent: "#f43f5e",       // Rose 500
      background: "#090514",   // Dark violet-black
      cardBg: "#120b24",
      border: "#2d1b54",
      textPrimary: "#fdfaff",
      textSecondary: "#b8a3e8"
    },
    corporate: {
      primary: "#1e3a8a",      // Blue 900
      secondary: "#475569",    // Slate 600
      accent: "#f59e0b",       // Amber 500
      background: "#ffffff",
      cardBg: "#f8fafc",
      border: "#e2e8f0",
      textPrimary: "#0f172a",
      textSecondary: "#475569"
    },
    agency: {
      primary: "#000000",
      secondary: "#4b5563",
      accent: "#f97316",       // Orange 500
      background: "#f3f4f6",
      cardBg: "#ffffff",
      border: "#d1d5db",
      textPrimary: "#111827",
      textSecondary: "#4b5563"
    },
    startup: {
      primary: "#6366f1",      // Indigo 500
      secondary: "#64748b",
      accent: "#3b82f6",       // Blue 500
      background: "#f8fafc",
      cardBg: "#ffffff",
      border: "#e2e8f0",
      textPrimary: "#0f172a",
      textSecondary: "#64748b"
    },
    luxury: {
      primary: "#d97706",      // Amber 600 / Gold
      secondary: "#a1a1aa",
      accent: "#b45309",       // Amber 700 / Bronze
      background: "#09090b",   // Zinc 950
      cardBg: "#18181b",       // Zinc 900
      border: "#27272a",       // Zinc 800
      textPrimary: "#f4f4f5",  // Zinc 100
      textSecondary: "#a1a1aa" // Zinc 500
    },
    enterprise: {
      primary: "#0f172a",      // Slate 900
      secondary: "#334155",
      accent: "#2563eb",
      background: "#ffffff",
      cardBg: "#f1f5f9",
      border: "#cbd5e1",
      textPrimary: "#0f172a",
      textSecondary: "#334155"
    }
  };

  // 2. Override based on selected user colorPalettePref
  const palette = { ...defaultPalettes[themeId] };

  if (normalizedPref.includes("ocean breeze") || normalizedPref.includes("blue/teal")) {
    palette.primary = "#0284c7";    // Sky 600
    palette.accent = "#0d9488";     // Teal 600
    if (themeId === "developer" || themeId === "creative" || themeId === "luxury") {
      palette.background = "#071b29";
      palette.cardBg = "#0e2e47";
      palette.border = "#1b4d70";
      palette.textPrimary = "#f0f9ff";
      palette.textSecondary = "#bae6fd";
    } else {
      palette.background = "#f0f9ff";
      palette.cardBg = "#ffffff";
      palette.border = "#bae6fd";
      palette.textPrimary = "#0369a1";
      palette.textSecondary = "#075985";
    }
  } else if (normalizedPref.includes("midnight neon") || normalizedPref.includes("purple/pink")) {
    palette.primary = "#a855f7";    // Purple 500
    palette.accent = "#ec4899";     // Pink 500
    if (themeId === "developer" || themeId === "creative" || themeId === "luxury") {
      palette.background = "#120321";
      palette.cardBg = "#1d0c30";
      palette.border = "#3d1e61";
      palette.textPrimary = "#faf5ff";
      palette.textSecondary = "#e9d5ff";
    } else {
      palette.background = "#faf5ff";
      palette.cardBg = "#ffffff";
      palette.border = "#e9d5ff";
      palette.textPrimary = "#7e22ce";
      palette.textSecondary = "#6b21a8";
    }
  } else if (normalizedPref.includes("forest green")) {
    palette.primary = "#15803d";    // Green 700
    palette.accent = "#b45309";     // Amber 700 / Autumn
    if (themeId === "developer" || themeId === "creative" || themeId === "luxury") {
      palette.background = "#052e16"; // Green 950
      palette.cardBg = "#14532d";     // Green 900
      palette.border = "#166534";     // Green 800
      palette.textPrimary = "#f0fdf4";
      palette.textSecondary = "#bbf7d0";
    } else {
      palette.background = "#f0fdf4";
      palette.cardBg = "#ffffff";
      palette.border = "#bbf7d0";
      palette.textPrimary = "#166534";
      palette.textSecondary = "#14532d";
    }
  } else if (normalizedPref.includes("classic dark mode")) {
    palette.primary = "#38bdf8";    // Sky 400
    palette.accent = "#818cf8";     // Indigo 400
    palette.background = "#0f172a"; // Slate 900
    palette.cardBg = "#1e293b";
    palette.border = "#334155";
    palette.textPrimary = "#f8fafc";
    palette.textSecondary = "#cbd5e1";
  } else if (normalizedPref.includes("nordic minimalist") || normalizedPref.includes("gray scale")) {
    palette.primary = "#09090b";
    palette.secondary = "#71717a";
    palette.accent = "#27272a";
    palette.background = "#f4f4f5";
    palette.cardBg = "#ffffff";
    palette.border = "#e4e4e7";
    palette.textPrimary = "#09090b";
    palette.textSecondary = "#71717a";
  }

  return palette;
}

/**
 * Resolves standard typography font families and scales deterministically.
 */
export function resolveTypography(themeId: ThemeId, fontPref?: string): TypographyConfig {
  const normPref = fontPref?.toLowerCase() || "";

  // 1. Defaults based on theme
  const defaults: Record<ThemeId, TypographyConfig> = {
    minimal: {
      headingsFont: "Inter, sans-serif",
      bodyFont: "Inter, sans-serif",
      monoFont: "Fira Code, monospace",
      headingScale: "minor-third",
      baseFontSize: "16px"
    },
    developer: {
      headingsFont: "Fira Code, monospace",
      bodyFont: "Inter, sans-serif",
      monoFont: "Fira Code, monospace",
      headingScale: "major-second",
      baseFontSize: "15px"
    },
    creative: {
      headingsFont: "Outfit, sans-serif",
      bodyFont: "Inter, sans-serif",
      monoFont: "Fira Code, monospace",
      headingScale: "perfect-fourth",
      baseFontSize: "16px"
    },
    corporate: {
      headingsFont: "Inter, sans-serif",
      bodyFont: "Roboto, sans-serif",
      monoFont: "Courier New, monospace",
      headingScale: "minor-third",
      baseFontSize: "16px"
    },
    agency: {
      headingsFont: "Outfit, sans-serif",
      bodyFont: "Outfit, sans-serif",
      monoFont: "Fira Code, monospace",
      headingScale: "perfect-fourth",
      baseFontSize: "16px"
    },
    startup: {
      headingsFont: "Outfit, sans-serif",
      bodyFont: "Inter, sans-serif",
      monoFont: "Fira Code, monospace",
      headingScale: "major-third",
      baseFontSize: "16px"
    },
    luxury: {
      headingsFont: "Playfair Display, Georgia, serif",
      bodyFont: "Roboto, sans-serif",
      monoFont: "Courier New, monospace",
      headingScale: "perfect-fifth",
      baseFontSize: "17px"
    },
    enterprise: {
      headingsFont: "Inter, sans-serif",
      bodyFont: "Inter, sans-serif",
      monoFont: "Fira Code, monospace",
      headingScale: "minor-third",
      baseFontSize: "16px"
    }
  };

  const config = { ...defaults[themeId] };

  // 2. Specific font overrides based on fontPref
  if (normPref.includes("serif") || normPref.includes("playfair")) {
    config.headingsFont = "Playfair Display, Georgia, serif";
  } else if (normPref.includes("mono") || normPref.includes("fira")) {
    config.headingsFont = "Fira Code, monospace";
    config.bodyFont = "Fira Code, monospace";
  } else if (normPref.includes("modern") || normPref.includes("outfit")) {
    config.headingsFont = "Outfit, sans-serif";
    config.bodyFont = "Outfit, sans-serif";
  } else if (normPref.includes("sans-serif") || normPref.includes("inter")) {
    config.headingsFont = "Inter, sans-serif";
    config.bodyFont = "Inter, sans-serif";
  }

  return config;
}

/**
 * Resolves standard branding settings.
 */
export function resolveBranding(
  themeId: ThemeId,
  brandName: string,
  websiteTitle: string,
  websiteTagline?: string,
  borderRadiusPref?: string
): BrandingConfig {
  const normRadius = borderRadiusPref?.toLowerCase() || "";
  let resolvedRadius = "8px"; // default medium

  if (normRadius.includes("none")) {
    resolvedRadius = "0px";
  } else if (normRadius.includes("small") || normRadius.includes("4px")) {
    resolvedRadius = "4px";
  } else if (normRadius.includes("medium") || normRadius.includes("8px")) {
    resolvedRadius = "8px";
  } else if (normRadius.includes("large") || normRadius.includes("16px")) {
    resolvedRadius = "16px";
  } else if (normRadius.includes("full") || normRadius.includes("round")) {
    resolvedRadius = "9999px";
  }

  // Derive tone descriptors from selected theme
  const themeTones: Record<ThemeId, string[]> = {
    minimal: ["Clean", "Spacious", "Modern", "Understated"],
    developer: ["Technical", "Efficient", "Dark-Mode", "Robust"],
    creative: ["Dynamic", "Vibrant", "Asymmetric", "Expressive"],
    corporate: ["Trustworthy", "Professional", "Structured", "Sleek"],
    agency: ["Bold", "High-Contrast", "Impactful", "Modern"],
    startup: ["Innovative", "Tech-Focused", "Clean", "Polished"],
    luxury: ["Elegant", "Premium", "Refined", "Serif-Focused"],
    enterprise: ["Structured", "Multi-Card", "Solid", "Professional"]
  };

  return {
    brandName,
    websiteTitle,
    websiteTagline,
    selectedThemeId: themeId,
    borderRadius: resolvedRadius,
    logoPlacement: themeId === "creative" ? "center" : "left",
    toneDescriptors: themeTones[themeId]
  };
}
