import { QACheckResult, QAContext, QAIssue } from "../types";
import { QaAgentConfig } from "../config/qa-agent-config";
import { QaValidators } from "../validators/qa-validators";

export class ContentQualityEngine {
  public static analyze(context: QAContext): QACheckResult {
    const issues: QAIssue[] = [];
    const warnings: string[] = [];
    const normalized = context.normalizedData;

    let score = 100;
    let deductPoints = (amount: number) => {
      score = Math.max(0, score - amount);
    };

    // 1. Required field verification
    const personal = normalized.personal || {};
    const requiredPersonal: { key: keyof typeof personal; label: string; severity: "critical" | "high" }[] = [
      { key: "fullName", label: "Full Name", severity: "critical" },
      { key: "profession", label: "Profession / Title", severity: "critical" },
      { key: "headline", label: "Headline tag", severity: "high" },
      { key: "bioSummary", label: "Bio Summary", severity: "critical" },
      { key: "email", label: "Email Address", severity: "critical" }
    ];

    for (const item of requiredPersonal) {
      if (!QaValidators.validateRequiredField(personal[item.key])) {
        deductPoints(item.severity === "critical" ? 15 : 8);
        issues.push({
          id: `content-missing-${item.key}`,
          category: "content",
          severity: item.severity,
          rule: `required-personal-${item.key}`,
          message: `Required field '${item.label}' is missing or empty.`,
          recommendation: `Add your ${item.label.toLowerCase()} to complete the core profile content.`,
          field: `personal.${item.key}`
        });
      }
    }

    // 2. Section lists count verification (skills, projects, experience, socials)
    if (!normalized.skills || normalized.skills.length < QaAgentConfig.content.minSkillsCount) {
      deductPoints(10);
      issues.push({
        id: "content-low-skills",
        category: "content",
        severity: "medium",
        rule: "min-skills-count",
        message: `Skills list is sparse. Only ${normalized.skills?.length || 0} skills defined.`,
        recommendation: `List at least ${QaAgentConfig.content.minSkillsCount} professional skills to show expertise breadth.`,
        field: "skills"
      });
    }

    if (!normalized.projects || normalized.projects.length < QaAgentConfig.content.minProjectsCount) {
      deductPoints(15);
      issues.push({
        id: "content-no-projects",
        category: "content",
        severity: "high",
        rule: "min-projects-count",
        message: "No portfolio projects defined.",
        recommendation: "Add at least one key project featuring your role, technologies, and achievements.",
        field: "projects"
      });
    }

    if (!normalized.experience || normalized.experience.length === 0) {
      warnings.push("No work experience entries defined.");
      issues.push({
        id: "content-no-experience",
        category: "content",
        severity: "low",
        rule: "min-experience-count",
        message: "No career history or experience entries found.",
        recommendation: "Add your work history to establish professional credibility.",
        field: "experience"
      });
    }

    // 3. Bio length boundaries
    if (personal.bioSummary) {
      const bioLen = personal.bioSummary.length;
      if (bioLen < QaAgentConfig.content.minBioLength) {
        deductPoints(8);
        issues.push({
          id: "content-short-bio",
          category: "content",
          severity: "medium",
          rule: "min-bio-length",
          message: `The bio summary is very short (${bioLen} chars).`,
          recommendation: "Elaborate your professional summary to at least 50 characters to hook visitors.",
          field: "personal.bioSummary"
        });
      } else if (bioLen > QaAgentConfig.content.maxBioLength) {
        warnings.push("Bio summary is quite long.");
        issues.push({
          id: "content-long-bio",
          category: "content",
          severity: "info",
          rule: "max-bio-length",
          message: `Bio summary exceeds recommended length (${bioLen} chars).`,
          recommendation: "Trim the bio summary to under 1,000 characters to keep it punchy and readable.",
          field: "personal.bioSummary"
        });
      }
    }

    // 4. Placeholder and Dummy data detection
    const checkPlaceholders = (text: string, path: string) => {
      const dummies = ["lorem ipsum", "todo", "placeholder", "dummy data", "lorem-ipsum", "test test", "foo bar", "temp string"];
      for (const d of dummies) {
        if (text.toLowerCase().includes(d)) {
          deductPoints(10);
          issues.push({
            id: `content-placeholder-${path}-${d.replace(" ", "-")}`,
            category: "content",
            severity: "high",
            rule: "no-placeholders",
            message: `Found dummy placeholder text "${d}" in content field.`,
            recommendation: `Replace the placeholder content at '${path}' with genuine details before compiling.`,
            field: path
          });
          break;
        }
      }
    };

    if (personal.bioSummary) checkPlaceholders(personal.bioSummary, "personal.bioSummary");
    if (personal.headline) checkPlaceholders(personal.headline, "personal.headline");
    
    if (normalized.projects) {
      normalized.projects.forEach((proj, idx) => {
        checkPlaceholders(proj.title, `projects[${idx}].title`);
        checkPlaceholders(proj.description, `projects[${idx}].description`);
      });
    }

    // 5. Tone & capitalization check
    if (personal.bioSummary) {
      const upperWords = personal.bioSummary.split(/\s+/).filter(w => w.length > 3 && w === w.toUpperCase() && /^[A-Z]+$/.test(w));
      if (upperWords.length > 3) {
        deductPoints(5);
        issues.push({
          id: "content-excessive-caps",
          category: "content",
          severity: "low",
          rule: "professional-tone",
          message: "Excessive capitalization detected in profile bio.",
          recommendation: "Avoid writing sentences in ALL CAPS to maintain a professional tone.",
          field: "personal.bioSummary"
        });
      }
    }

    // 6. Section size balance check
    if (context.contentBlocks && context.contentBlocks.length > 2) {
      const blockSizes = context.contentBlocks.map(b => JSON.stringify(b.content).length);
      const maxSize = Math.max(...blockSizes);
      const minSize = Math.min(...blockSizes.filter(s => s > 0));
      if (minSize > 0 && maxSize / minSize > QaAgentConfig.content.maxSectionImbalanceRatio) {
        warnings.push("Portfolio sections visual/textual size is heavily unbalanced.");
        issues.push({
          id: "content-section-imbalance",
          category: "content",
          severity: "info",
          rule: "section-balance",
          message: "Some sections contain vastly more details than others, causing visual imbalance.",
          recommendation: "Balance the content length of your key sections to create an even, clean layout page flow."
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
