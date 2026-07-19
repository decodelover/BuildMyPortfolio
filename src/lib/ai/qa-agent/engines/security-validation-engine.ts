import { QACheckResult, QAContext, QAIssue } from "../types";
import { QaAgentConfig } from "../config/qa-agent-config";
import { QaSanitizer } from "../security/qa-sanitizer";

export class SecurityValidationEngine {
  public static analyze(context: QAContext): QACheckResult {
    const issues: QAIssue[] = [];
    const warnings: string[] = [];
    const normalized = context.normalizedData;

    let score = 100;
    const deductPoints = (amount: number) => {
      score = Math.max(0, score - amount);
    };

    // 1. Check all text fields for XSS scripting tags and patterns
    const scanTextField = (val: string, path: string) => {
      if (QaAgentConfig.security.scriptInjections.test(val)) {
        deductPoints(25);
        issues.push({
          id: `security-xss-script-${path.replace(/[\[\].]/g, "-")}`,
          category: "security",
          severity: "critical",
          rule: "no-script-injections",
          message: `Malicious script tags detected in field: "${path}".`,
          recommendation: "Remove any script tags or tag structures entirely from content inputs.",
          field: path
        });
      }

      if (QaAgentConfig.security.xssEventHandlerPatterns.test(val)) {
        deductPoints(20);
        issues.push({
          id: `security-xss-event-${path.replace(/[\[\].]/g, "-")}`,
          category: "security",
          severity: "critical",
          rule: "no-event-handlers",
          message: `Potential inline javascript event handler detected in field: "${path}".`,
          recommendation: "Ensure content fields do not contain active attributes (like onerror, onload, onclick).",
          field: path
        });
      }

      if (QaSanitizer.hasPotentialSqlInjection(val)) {
        deductPoints(15);
        issues.push({
          id: `security-sql-inject-${path.replace(/[\[\].]/g, "-")}`,
          category: "security",
          severity: "high",
          rule: "no-sql-injection-heuristics",
          message: `Possible SQL code injection patterns identified in text block: "${path}".`,
          recommendation: "Avoid writing standard SQL query fragments inside input texts.",
          field: path
        });
      }
    };

    const personal = normalized.personal || {};
    if (personal.fullName) scanTextField(personal.fullName, "personal.fullName");
    if (personal.profession) scanTextField(personal.profession, "personal.profession");
    if (personal.headline) scanTextField(personal.headline, "personal.headline");
    if (personal.bioSummary) scanTextField(personal.bioSummary, "personal.bioSummary");

    if (normalized.projects) {
      normalized.projects.forEach((proj, idx) => {
        scanTextField(proj.title, `projects[${idx}].title`);
        scanTextField(proj.description, `projects[${idx}].description`);
      });
    }

    if (normalized.experience) {
      normalized.experience.forEach((exp, idx) => {
        scanTextField(exp.role, `experience[${idx}].role`);
        scanTextField(exp.company, `experience[${idx}].company`);
        scanTextField(exp.description, `experience[${idx}].description`);
      });
    }

    // 2. Validate URL safety (dangerous protocols)
    const scanUrlField = (url: string | undefined, path: string) => {
      if (!url) return;
      try {
        QaSanitizer.sanitizeUrl(url);
      } catch (err: any) {
        deductPoints(25);
        issues.push({
          id: `security-dangerous-url-${path.replace(/[\[\].]/g, "-")}`,
          category: "security",
          severity: "critical",
          rule: "safe-url-protocols",
          message: `Unsafe URL protocol or script block detected in: "${url}".`,
          recommendation: "Configure absolute URLs that use the standard HTTP or HTTPS protocols.",
          field: path
        });
      }
    };

    if (normalized.socials) {
      for (const [platform, url] of Object.entries(normalized.socials)) {
        scanUrlField(url, `socials.${platform}`);
      }
    }

    if (normalized.projects) {
      normalized.projects.forEach((proj, idx) => {
        if (proj.liveUrl) scanUrlField(proj.liveUrl, `projects[${idx}].liveUrl`);
        if (proj.githubUrl) scanUrlField(proj.githubUrl, `projects[${idx}].githubUrl`);
        if (proj.imageUrl) scanUrlField(proj.imageUrl, `projects[${idx}].imageUrl`);
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
