import { QAContext } from "../types";
import { QaSecurityError } from "../errors/qa-agent-errors";
import { QaAgentConfig } from "../config/qa-agent-config";

export class QaSanitizer {
  public static sanitize(context: QAContext): QAContext {
    const copy = { ...context };

    const checkValue = (val: any, path: string) => {
      if (typeof val === "string") {
        if (QaAgentConfig.security.scriptInjections.test(val)) {
          throw new QaSecurityError(`Malicious script tags detected in QA input: ${path}`);
        }
        if (QaAgentConfig.security.xssEventHandlerPatterns.test(val)) {
          throw new QaSecurityError(`Potential event handler XSS injection in QA input: ${path}`);
        }
      } else if (val && typeof val === "object") {
        for (const key of Object.keys(val)) {
          checkValue(val[key], `${path}.${key}`);
        }
      }
    };

    // Deep inspect raw input
    checkValue(copy.rawInput, "rawInput");

    return copy;
  }

  public static sanitizeUrl(url?: string): string {
    if (!url) return "";
    const trimmed = url.trim();

    if (QaAgentConfig.security.dangerousProtocols.test(trimmed)) {
      throw new QaSecurityError(`Dangerous protocol detected in URL: ${trimmed}`);
    }

    if (trimmed.includes("<") || trimmed.includes(">") || trimmed.includes('"') || trimmed.includes("'")) {
      throw new QaSecurityError(`Malformed URL containing potential injection characters: ${trimmed}`);
    }

    return trimmed;
  }

  public static escapeHtml(str?: string): string {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  }

  public static hasPotentialSqlInjection(str?: string): boolean {
    if (!str) return false;
    return QaAgentConfig.security.sqlInjectionHeuristics.test(str);
  }
}
