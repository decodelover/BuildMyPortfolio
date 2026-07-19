import { QACheckResult, QAContext, QAIssue } from "../types";
import { QaAgentConfig } from "../config/qa-agent-config";

export class PerformanceEngine {
  public static analyze(context: QAContext): QACheckResult {
    const issues: QAIssue[] = [];
    const warnings: string[] = [];
    const normalized = context.normalizedData;

    let score = 100;
    const deductPoints = (amount: number) => {
      score = Math.max(0, score - amount);
    };

    // 1. Total Section Count Check (too many sections block the main thread and impact page loading speed)
    const blockCount = context.contentBlocks ? context.contentBlocks.length : 0;
    if (blockCount > 8) {
      warnings.push("High number of layout sections on the landing page.");
      issues.push({
        id: "perf-too-many-sections",
        category: "performance",
        severity: "medium",
        rule: "optimized-sections-size",
        message: `Landing page contains ${blockCount} sections, which may decrease rendering speed.`,
        recommendation: "Consider consolidating sections or implementing tabbed sub-views to improve initial load time."
      });
      deductPoints(10);
    }

    // 2. Project images lazy loading check
    const projectCount = normalized.projects ? normalized.projects.length : 0;
    const hasManyImages = projectCount > 4;
    if (hasManyImages) {
      const seoBlueprint = context.seoBlueprint;
      const lazyStrategy = seoBlueprint?.technicalRules?.lazyLoadingStrategy;
      if (!lazyStrategy || lazyStrategy.images !== "lazy") {
        issues.push({
          id: "perf-lazy-load-missing",
          category: "performance",
          severity: "high",
          rule: "lazy-loading-enabled",
          message: `Multiple project cards (${projectCount}) are rendered without lazy loading properties.`,
          recommendation: "Ensure lazy loading is enabled for all below-fold images to speed up initial rendering.",
          field: "seoBlueprint.technicalRules.lazyLoadingStrategy"
        });
        deductPoints(15);
      }
    }

    // 3. Animation intensity check (excessive animations degrade framerates, especially on mobile)
    const design = context.designBlueprint;
    if (design?.animations) {
      const anims = design.animations;
      if (anims.motionIntensity === "high") {
        warnings.push("High motion intensity animations may lag on low-end mobile devices.");
        issues.push({
          id: "perf-excessive-animations",
          category: "performance",
          severity: "low",
          rule: "optimized-motion-intensity",
          message: "Animation motion density is set to high, which could affect scroll fluidity.",
          recommendation: "Change motionIntensity to 'medium' or ensure a fallback for reduced-motion is in place.",
          field: "designBlueprint.animations.motionIntensity"
        });
        deductPoints(5);
      }
    }

    // 4. Asset loading rules checking
    const fontDisplay = seoBlueprintFontDisplayRule(context);
    if (fontDisplay && fontDisplay !== "swap" && fontDisplay !== "optional") {
      warnings.push("Font render blocking display setting is sub-optimal.");
      issues.push({
        id: "perf-font-display-blocking",
        category: "performance",
        severity: "low",
        rule: "non-blocking-fonts",
        message: "Font display rule is not configured to 'swap' or 'optional'.",
        recommendation: "Configure fontDisplayRule to 'swap' in technical SEO options to improve First Contentful Paint.",
        field: "seoBlueprint.technicalRules.assetOptimization.fontDisplayRule"
      });
      deductPoints(5);
    }

    return {
      passed: score >= QaAgentConfig.thresholds.dimensionMinScore,
      score,
      issues,
      warnings
    };
  }
}

function seoBlueprintFontDisplayRule(context: QAContext): string | undefined {
  return context.seoBlueprint?.technicalRules?.assetOptimization?.fontDisplayRule;
}
