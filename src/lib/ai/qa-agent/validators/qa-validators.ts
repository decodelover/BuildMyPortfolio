import { QualityReport } from "../types";
import { QaAgentConfig } from "../config/qa-agent-config";

export class QaValidators {
  public static validateUrl(url?: string): boolean {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

  public static validateEmail(email?: string): boolean {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public static validateImageFormat(url?: string): boolean {
    if (!url) return false;
    const extensionRegex = /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i;
    // Check if it's a valid data URL or has a valid extension
    if (url.startsWith("data:image/")) return true;
    return extensionRegex.test(url) || url.includes("images.unsplash.com") || url.includes("images.pexels.com");
  }

  public static validateStringLength(str?: string, min: number = 0, max: number = Infinity): boolean {
    if (!str) return min === 0;
    return str.length >= min && str.length <= max;
  }

  public static validateRequiredField(value: any): boolean {
    if (value === undefined || value === null) return false;
    if (typeof value === "string") return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object") return Object.keys(value).length > 0;
    return true;
  }

  public static validateHtmlSafety(content?: string): boolean {
    if (!content) return true;
    return !QaAgentConfig.security.scriptInjections.test(content) &&
      !QaAgentConfig.security.xssEventHandlerPatterns.test(content);
  }

  public static validateReport(report: QualityReport): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!report.reportId) errors.push("Report ID is missing.");
    if (!report.userId) errors.push("User ID is missing.");
    if (!report.builderId) errors.push("Builder ID is missing.");
    if (!report.planId) errors.push("Plan ID is missing.");
    if (!report.scores) {
      errors.push("Scores block is missing.");
    } else {
      const requiredScores: (keyof typeof report.scores)[] = [
        "contentQuality",
        "designQuality",
        "seoQuality",
        "accessibility",
        "performance",
        "technicalIntegrity",
        "security",
        "professionalism",
        "portfolioCompleteness",
        "overall"
      ];
      for (const key of requiredScores) {
        if (typeof report.scores[key] !== "number" || isNaN(report.scores[key])) {
          errors.push(`Score field '${key}' must be a valid number.`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
