import { QACheckResult, QAContext, QAIssue } from "../types";
import { QaAgentConfig } from "../config/qa-agent-config";

export class SeoQualityEngine {
  public static analyze(context: QAContext): QACheckResult {
    const issues: QAIssue[] = [];
    const warnings: string[] = [];
    const blueprint = context.seoBlueprint;

    if (!blueprint) {
      return {
        passed: false,
        score: 0,
        issues: [{
          id: "seo-blueprint-missing",
          category: "seo",
          severity: "critical",
          rule: "seo-blueprint-required",
          message: "SEO Agent blueprint is completely missing.",
          recommendation: "Ensure the SEO Agent pipeline runs successfully before QA evaluation."
        }],
        warnings: ["No SEO metadata mapping loaded for validation."]
      };
    }

    let score = 100;
    let deductPoints = (amount: number) => {
      score = Math.max(0, score - amount);
    };

    // 1. Metadata Validation
    const metadata = blueprint.metadata;
    if (!metadata) {
      deductPoints(30);
      issues.push({
        id: "seo-metadata-missing",
        category: "seo",
        severity: "critical",
        rule: "meta-tags-required",
        message: "Page SEO metadata is missing in the blueprint.",
        recommendation: "Re-run SEO generation to construct meta tags.",
        field: "metadata"
      });
    } else {
      // Title tags
      if (!metadata.metaTitle) {
        deductPoints(15);
        issues.push({
          id: "seo-title-missing",
          category: "seo",
          severity: "high",
          rule: "meta-title-present",
          message: "Meta Title tag is missing or empty.",
          recommendation: "Add a meta title tag to ensure your portfolio can be indexed with a title.",
          field: "metadata.metaTitle"
        });
      } else {
        const len = metadata.metaTitle.length;
        if (len < 30 || len > 60) {
          deductPoints(5);
          issues.push({
            id: "seo-title-length",
            category: "seo",
            severity: "low",
            rule: "meta-title-length-range",
            message: `Meta title length is suboptimal (${len} characters). Recommended: 30-60.`,
            recommendation: "Revise the meta title length to be between 30 and 60 characters for search listings.",
            field: "metadata.metaTitle"
          });
        }
      }

      // Description tags
      if (!metadata.metaDescription) {
        deductPoints(15);
        issues.push({
          id: "seo-description-missing",
          category: "seo",
          severity: "high",
          rule: "meta-description-present",
          message: "Meta Description tag is missing or empty.",
          recommendation: "Provide a meta description tag summarizing your skills and experience.",
          field: "metadata.metaDescription"
        });
      } else {
        const len = metadata.metaDescription.length;
        if (len < 70 || len > 160) {
          deductPoints(5);
          issues.push({
            id: "seo-description-length",
            category: "seo",
            severity: "low",
            rule: "meta-description-length-range",
            message: `Meta description length is suboptimal (${len} characters). Recommended: 70-160.`,
            recommendation: "Adjust the meta description to be between 70 and 160 characters to avoid truncation in SERPs.",
            field: "metadata.metaDescription"
          });
        }
      }
    }

    // 2. Structured Data Schemas
    const schemas = blueprint.structuredData;
    if (!schemas || !schemas.person || !schemas.profilePage) {
      deductPoints(15);
      issues.push({
        id: "seo-schemas-incomplete",
        category: "seo",
        severity: "medium",
        rule: "structured-data-schemas",
        message: "JSON-LD schema properties (Person/ProfilePage) are not fully compiled.",
        recommendation: "Complete schemas so rich snippets can render in search listings.",
        field: "structuredData"
      });
    }

    // 3. Open Graph and Twitter Previews
    const social = blueprint.social;
    if (!social || !social.openGraph || !social.twitter) {
      warnings.push("Social share previews are not fully configured.");
      issues.push({
        id: "seo-social-missing",
        category: "seo",
        severity: "medium",
        rule: "social-previews-set",
        message: "Open Graph or Twitter meta tags are missing.",
        recommendation: "Define social preview templates to enable high-quality sharing previews.",
        field: "social"
      });
    }

    // 4. Slugs and URLs
    if (!metadata?.portfolioSlug) {
      deductPoints(10);
      issues.push({
        id: "seo-slug-missing",
        category: "seo",
        severity: "high",
        rule: "url-slug-valid",
        message: "Portfolio URL slug identifier is not set.",
        recommendation: "Establish a unique profile path slug.",
        field: "metadata.portfolioSlug"
      });
    } else {
      const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugPattern.test(blueprint.metadata.portfolioSlug)) {
        deductPoints(10);
        issues.push({
          id: "seo-slug-invalid",
          category: "seo",
          severity: "high",
          rule: "url-slug-format",
          message: `Portfolio url slug format "${blueprint.metadata.portfolioSlug}" is invalid.`,
          recommendation: "Use lowercase letters, numbers, and single hyphens only for cleaner URLs.",
          field: "metadata.portfolioSlug"
        });
      }
    }

    // 5. Keyword Density Checks
    const analysis = blueprint.contentAnalysis;
    if (analysis && analysis.keywordDensity) {
      const densities = Object.entries(analysis.keywordDensity);
      const highDensity = densities.filter(([_, d]) => d > 5.0);
      if (highDensity.length > 0) {
        warnings.push(`Keyword stuffing warning: Keywords [${highDensity.map(k => k[0]).join(", ")}] have high density.`);
        issues.push({
          id: "seo-keyword-stuffing",
          category: "seo",
          severity: "low",
          rule: "keyword-density-bounds",
          message: `Some keywords are excessively repeated (density > 5%): ${highDensity.map(k => k[0]).join(", ")}.`,
          recommendation: "Reduce repetition of these keywords to prevent search indexing penalties.",
          field: "contentAnalysis.keywordDensity"
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
