import { AIProviderConfig } from "../config/ai-provider-config";
import { AISafetyError } from "../errors/ai-provider-errors";

export interface SafetyCheckResult {
  isSafe: boolean;
  violations: string[];
  sanitizedPrompt: string;
}

export class SafetyFilter {
  public static inspectPrompt(prompt: string): SafetyCheckResult {
    if (!prompt || typeof prompt !== "string") {
      return { isSafe: true, violations: [], sanitizedPrompt: "" };
    }

    const violations: string[] = [];
    const lowerPrompt = prompt.toLowerCase();

    // Check blocklist
    for (const pattern of AIProviderConfig.injectionBlocklist) {
      if (lowerPrompt.includes(pattern.toLowerCase())) {
        violations.push(`Prompt injection pattern detected: '${pattern}'`);
      }
    }

    // Check for malicious code execution strings
    if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(prompt)) {
      violations.push("Script tag injection pattern detected.");
    }

    const isSafe = violations.length === 0;

    if (!isSafe) {
      throw new AISafetyError(`Safety Filter blocked AI request due to violations: ${violations.join("; ")}`, undefined, { violations });
    }

    return {
      isSafe: true,
      violations: [],
      sanitizedPrompt: prompt
    };
  }

  public static sanitizeOutput(text: string): string {
    if (!text) return "";
    let sanitized = text;
    // Strip null characters
    sanitized = sanitized.replace(/\0/g, "");
    // Neutralize dangerous inline script executions
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "[script removed]");
    return sanitized;
  }
}
