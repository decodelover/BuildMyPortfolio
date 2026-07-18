import { AccessibilityDecision, DesignContext } from "../types";

export class AccessibilityEngine {
  
  public static resolve(context: DesignContext): AccessibilityDecision {
    const isDark = ["dark-developer", "glassmorphism", "creative"].includes(context.themePreference.toLowerCase());

    const ariaRolesMap: Record<string, string> = {
      hero: "banner",
      about: "region",
      skills: "region",
      projects: "region",
      experience: "region",
      services: "region",
      testimonials: "region",
      blog: "region",
      contact: "form",
      footer: "contentinfo"
    };

    const ariaLabelsNeeded = [
      "Skip to main content link",
      "Main navigation menu",
      "Social media links footer block",
      "Project category selector tabs",
      "Submit contact inquiry button"
    ];

    return {
      minimumContrastRatio: {
        normalText: isDark ? "5.0:1" : "4.5:1", // Meet WCAG AA standards
        largeText: "3.0:1"
      },
      minFontSize: "14px",
      focusOutlineStyle: "outline-2 outline-offset-2 outline-indigo-500",
      keyboardNavigationHints: {
        supportsSkipLink: true,
        ariaRolesMap
      },
      ariaLabelsNeeded,
      wcagComplianceLevel: "AA"
    };
  }
}
