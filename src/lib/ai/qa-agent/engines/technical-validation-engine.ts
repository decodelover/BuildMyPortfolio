import { QACheckResult, QAContext, QAIssue } from "../types";
import { QaAgentConfig } from "../config/qa-agent-config";
import { QaValidators } from "../validators/qa-validators";

export class TechnicalValidationEngine {
  public static analyze(context: QAContext): QACheckResult {
    const issues: QAIssue[] = [];
    const warnings: string[] = [];
    const normalized = context.normalizedData;

    let score = 100;
    const deductPoints = (amount: number) => {
      score = Math.max(0, score - amount);
    };

    // 1. Email structure checking
    const email = normalized.personal?.email;
    if (email && !QaValidators.validateEmail(email)) {
      deductPoints(20);
      issues.push({
        id: "tech-invalid-email",
        category: "technical",
        severity: "critical",
        rule: "valid-email",
        message: `Contact email address format is invalid: "${email}".`,
        recommendation: "Provide a valid email address (e.g., user@example.com) to allow visitors to contact you.",
        field: "personal.email"
      });
    }

    // 2. Link format validation across socials, projects, and custom bookmarks
    const checkProfileLink = (url: string | undefined, platform: string, field: string) => {
      if (!url) return;
      if (!QaValidators.validateUrl(url)) {
        deductPoints(15);
        issues.push({
          id: `tech-invalid-link-${field}`,
          category: "technical",
          severity: "high",
          rule: `valid-url-${field}`,
          message: `The ${platform} link URL is malformed: "${url}".`,
          recommendation: "Provide a fully qualified URL starting with http:// or https://.",
          field
        });
        return;
      }

      // Verify domain specifics for GitHub and LinkedIn if possible
      if (platform.toLowerCase() === "github" && !url.includes("github.com")) {
        warnings.push(`GitHub link field contains an external domain URL: ${url}`);
      }
      if (platform.toLowerCase() === "linkedin" && !url.includes("linkedin.com")) {
        warnings.push(`LinkedIn link field contains an external domain URL: ${url}`);
      }
    };

    if (normalized.socials) {
      for (const [platform, url] of Object.entries(normalized.socials)) {
        checkProfileLink(url, platform, `socials.${platform}`);
      }
    }

    // 3. Project specific links checks
    if (normalized.projects) {
      normalized.projects.forEach((proj, index) => {
        if (proj.liveUrl) {
          checkProfileLink(proj.liveUrl, "Project Live", `projects[${index}].liveUrl`);
        }
        if (proj.githubUrl) {
          checkProfileLink(proj.githubUrl, "Project Repo", `projects[${index}].githubUrl`);
        }

        // Image validation
        if (proj.imageUrl) {
          if (!QaValidators.validateUrl(proj.imageUrl) && !proj.imageUrl.startsWith("/")) {
            deductPoints(8);
            issues.push({
              id: `tech-invalid-project-img-${proj.id}`,
              category: "technical",
              severity: "medium",
              rule: "valid-project-image",
              message: `Project image path is malformed: "${proj.imageUrl}".`,
              recommendation: "Use a valid absolute image url or local static relative path format.",
              field: `projects[${index}].imageUrl`
            });
          } else if (!QaValidators.validateImageFormat(proj.imageUrl)) {
            warnings.push(`Project image does not have a standard extension format: ${proj.imageUrl}`);
          }
        } else {
          warnings.push(`Project "${proj.title}" is missing an illustration image.`);
          issues.push({
            id: `tech-missing-project-img-${proj.id}`,
            category: "technical",
            severity: "low",
            rule: "project-image-supplied",
            message: `Project "${proj.title}" has no visual display image.`,
            recommendation: "Supply a screenshot link to improve the visual appeal of your project card.",
            field: `projects[${index}].imageUrl`
          });
        }
      });
    }

    return {
      passed: score >= QaAgentConfig.thresholds.dimensionMinScore,
      score,
      issues,
      warnings
    };
  }
}
