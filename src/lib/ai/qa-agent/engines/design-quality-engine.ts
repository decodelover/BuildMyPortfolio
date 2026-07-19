import { QACheckResult, QAContext, QAIssue } from "../types";
import { QaAgentConfig } from "../config/qa-agent-config";

export class DesignQualityEngine {
  public static analyze(context: QAContext): QACheckResult {
    const issues: QAIssue[] = [];
    const warnings: string[] = [];
    const blueprint = context.designBlueprint;

    if (!blueprint) {
      return {
        passed: false,
        score: 0,
        issues: [{
          id: "design-blueprint-missing",
          category: "design",
          severity: "critical",
          rule: "blueprint-required",
          message: "Design Agent blueprint is completely missing.",
          recommendation: "Ensure the Design Agent pipeline completes execution before running QA verification."
        }],
        warnings: ["No design configuration was loaded for verification."]
      };
    }

    let score = 100;
    let deductPoints = (amount: number) => {
      score = Math.max(0, score - amount);
    };

    // 1. Theme Configuration Checks
    const theme = blueprint.theme;
    if (!theme) {
      deductPoints(30);
      issues.push({
        id: "design-theme-missing",
        category: "design",
        severity: "critical",
        rule: "theme-required",
        message: "Visual theme tokens are missing in the design blueprint.",
        recommendation: "Verify the theme-engine outputs standard custom styling structures.",
        field: "theme"
      });
    } else {
      // Color verification
      const colors = theme.colors || {};
      const requiredColors = ["primary", "secondary", "background", "textPrimary", "border"];
      for (const col of requiredColors) {
        if (!colors[col as keyof typeof colors]) {
          deductPoints(8);
          issues.push({
            id: `design-color-missing-${col}`,
            category: "design",
            severity: "high",
            rule: `color-token-${col}`,
            message: `Required theme color token '${col}' is missing.`,
            recommendation: `Add a fallback value for colors.${col} to guarantee layout rendering safety.`,
            field: `theme.colors.${col}`
          });
        }
      }

      // Font tokens verification
      const typography = theme.typography || {};
      if (!typography.headingsFont || !typography.bodyFont) {
        deductPoints(10);
        issues.push({
          id: "design-fonts-missing",
          category: "design",
          severity: "medium",
          rule: "typography-fonts-defined",
          message: "Standard design fonts are not fully mapped in typography tokens.",
          recommendation: "Configure distinct headlinesFont and bodyFont values.",
          field: "theme.typography"
        });
      }
    }

    // 2. Layout Decisions Checks
    const layouts = blueprint.layouts || [];
    if (layouts.length === 0) {
      deductPoints(20);
      issues.push({
        id: "design-layouts-empty",
        category: "design",
        severity: "high",
        rule: "layout-sections-mapped",
        message: "No layout decisions defined for compiling section templates.",
        recommendation: "Generate custom card/grid order layout specifications for the sections.",
        field: "layouts"
      });
    } else {
      // Cross-check content blocks vs layouts mapped
      if (context.contentBlocks && context.contentBlocks.length > 0) {
        const mappedTypes = new Set(layouts.map(l => l.type));
        const unmappedBlocks = context.contentBlocks.filter(b => !mappedTypes.has(b.type));
        if (unmappedBlocks.length > 0) {
          deductPoints(10);
          issues.push({
            id: "design-layouts-incomplete",
            category: "design",
            severity: "medium",
            rule: "all-blocks-designed",
            message: `Design blueprint contains unmapped section layouts: ${unmappedBlocks.map(b => b.type).join(", ")}.`,
            recommendation: "Map matching grid variants or flex patterns for all generated copy blocks.",
            field: "layouts"
          });
        }
      }
    }

    // 3. Components Mapping Checks
    const components = blueprint.components || [];
    if (components.length === 0) {
      warnings.push("Design blueprint specifies no component level layout choices.");
    }

    // 4. Responsive Decisions Checks
    const responsive = blueprint.responsive || {};
    if (!responsive.adaptiveLayouts || responsive.adaptiveLayouts.length === 0) {
      deductPoints(12);
      issues.push({
        id: "design-responsive-missing",
        category: "design",
        severity: "high",
        rule: "responsive-breakpoints-mapped",
        message: "No responsive grid adaptive layouts are mapped in design rules.",
        recommendation: "Map sizing rules for mobile and desktop screens to prevent broken flow views.",
        field: "responsive"
      });
    }

    // 5. Accessibility Decisions Check
    const access = blueprint.accessibility || {};
    if (access.wcagComplianceLevel && access.wcagComplianceLevel !== "AA" && access.wcagComplianceLevel !== "AAA") {
      warnings.push("Accessibility target compliance level is below WCAG AA guidelines.");
    }

    return {
      passed: score >= QaAgentConfig.thresholds.dimensionMinScore,
      score,
      issues,
      warnings
    };
  }
}
