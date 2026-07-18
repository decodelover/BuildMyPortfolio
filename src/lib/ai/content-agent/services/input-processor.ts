import { PortfolioInputData, NormalizedPortfolioData, PortfolioValidationResult, ValidationIssue } from "../types";
import { sanitizePortfolioData, detectPromptInjection } from "../security/sanitizer";
import {
  validatePersonalInfo,
  validateSkills,
  validateProjects,
  validateExperience,
  validateEducation,
  validateSocialLinks
} from "../validators/portfolio-validators";
import { DataNormalizer } from "./data-normalizer";
import { SecurityViolationError } from "../errors/content-agent-errors";

export class InputProcessor {
  
  public static process(raw: PortfolioInputData): {
    data: NormalizedPortfolioData;
    validation: PortfolioValidationResult;
  } {
    // 1. Heuristic Security Checks (Prompt Injection)
    const rawString = JSON.stringify(raw);
    if (detectPromptInjection(rawString)) {
      throw new SecurityViolationError(
        "Potential prompt injection pattern detected in portfolio configuration inputs."
      );
    }

    // 2. Escape & Sanitize Input
    const sanitized = sanitizePortfolioData(raw);

    // 3. Validation execution
    const issues: ValidationIssue[] = [];
    issues.push(...validatePersonalInfo(sanitized.personalInfo));
    issues.push(...validateSkills(sanitized.skills));
    issues.push(...validateProjects(sanitized.projects));
    issues.push(...validateExperience(sanitized.experience));
    issues.push(...validateEducation(sanitized.education));
    issues.push(...validateSocialLinks(sanitized.socialLinks));

    // 4. Score completeness (based on filled fields and severity of issues)
    const criticalErrors = issues.filter((i) => i.severity === "error").length;
    const warnings = issues.filter((i) => i.severity === "warning").length;
    
    // Base completeness score calculation logic
    let completenessScore = 100;
    completenessScore -= criticalErrors * 15;
    completenessScore -= warnings * 5;
    completenessScore = Math.max(0, Math.min(100, completenessScore));

    const validation: PortfolioValidationResult = {
      isValid: criticalErrors === 0,
      issues,
      completenessScore
    };

    // 5. Normalize fields into standard data schema
    const data = DataNormalizer.normalize(sanitized);

    return {
      data,
      validation
    };
  }
}
