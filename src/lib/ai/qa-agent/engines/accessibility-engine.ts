import { QACheckResult, QAContext, QAIssue } from "../types";
import { QaAgentConfig } from "../config/qa-agent-config";

export class AccessibilityEngine {
  public static analyze(context: QAContext): QACheckResult {
    const issues: QAIssue[] = [];
    const warnings: string[] = [];
    const normalized = context.normalizedData;

    let score = 100;
    const deductPoints = (amount: number) => {
      score = Math.max(0, score - amount);
    };

    // 1. Image ALT text coverage verification
    if (normalized.projects) {
      const _missingAltCount = normalized.projects.filter(p => p.imageUrl && !p.title).length; // simple check logic
      const seo = context.seoBlueprint;
      if (seo?.accessibility?.imageAltTextStatus && !seo.accessibility.imageAltTextStatus.hasAlt) {
        deductPoints(15);
        issues.push({
          id: "access-missing-image-alts",
          category: "accessibility",
          severity: "high",
          rule: "alt-attributes-supplied",
          message: `Some images in the portfolio are missing alternative descriptive text (ALT).`,
          recommendation: "Provide specific alternative descriptions for all project and profile photos.",
          field: "seoBlueprint.accessibility.imageAltTextStatus"
        });
      }
    }

    // 2. Headings hierarchy checks (from content blocks or SEO analysis)
    const seo = context.seoBlueprint;
    if (seo?.contentAnalysis?.headingHierarchy && !seo.contentAnalysis.headingHierarchy.isValid) {
      deductPoints(10);
      issues.push({
        id: "access-invalid-heading-order",
        category: "accessibility",
        severity: "medium",
        rule: "headings-hierarchical-structure",
        message: `Semantic header ordering is broken: ${seo.contentAnalysis.headingHierarchy.issues.join(", ")}.`,
        recommendation: "Re-organize heading weights chronologically (H1, then H2, then sub H3 sections) without skipping sizes.",
        field: "seoBlueprint.contentAnalysis.headingHierarchy"
      });
    }

    // 3. Design specific accessibility settings checks
    const design = context.designBlueprint;
    if (design?.accessibility) {
      const access = design.accessibility;

      // Focus styles outline checks (crucial for keyboard navigate access)
      if (!access.focusOutlineStyle) {
        deductPoints(15);
        issues.push({
          id: "access-focus-outline-missing",
          category: "accessibility",
          severity: "high",
          rule: "visible-focus-outline",
          message: "No focus state outline styles are configured in design options.",
          recommendation: "Define a clear visible outline styling for active controls/inputs to aid keyboard-only navigation.",
          field: "designBlueprint.accessibility.focusOutlineStyle"
        });
      }

      // Skip link support checking
      if (!access.keyboardNavigationHints?.supportsSkipLink) {
        warnings.push("Keyboard skip links are not enabled.");
        issues.push({
          id: "access-skip-link-missing",
          category: "accessibility",
          severity: "low",
          rule: "keyboard-skip-link",
          message: "Skip navigation link helper is disabled.",
          recommendation: "Enable key nav skip links to bypass header links directly to content.",
          field: "designBlueprint.accessibility.keyboardNavigationHints.supportsSkipLink"
        });
        deductPoints(5);
      }

      // Aria labels defined check
      const labels = access.ariaLabelsNeeded || [];
      const hasReqLabels = QaAgentConfig.accessibility.requiredAriaLabels.every(l => labels.includes(l));
      if (!hasReqLabels) {
        deductPoints(8);
        issues.push({
          id: "access-aria-labels-incomplete",
          category: "accessibility",
          severity: "medium",
          rule: "aria-landmarks-configured",
          message: "Aria layout labels are not fully mapped in the design decisions.",
          recommendation: `Add ARIA landmarks mapping for elements such as: ${QaAgentConfig.accessibility.requiredAriaLabels.join(", ")}.`,
          field: "designBlueprint.accessibility.ariaLabelsNeeded"
        });
      }
    }

    return {
      passed: score >= QaAgentConfig.thresholds.dimensionMinScore,
      score,
      issues,
      warnings
    };
  }
}
