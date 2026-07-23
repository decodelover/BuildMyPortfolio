export interface SecurityValidationResult {
  isValid: boolean;
  sanitizedValue: string;
  threatsDetected: string[];
}

export class SecurityEngine {
  /**
   * Input Sanitization & XSS Prevention
   * Escapes HTML entities, strips inline script tags, javascript: URIs, and dangerous attributes.
   */
  public static sanitizeInput(input: string): SecurityValidationResult {
    if (!input || typeof input !== "string") {
      return { isValid: true, sanitizedValue: "", threatsDetected: [] };
    }

    const threatsDetected: string[] = [];

    // Check for inline script tags
    if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(input)) {
      threatsDetected.push("XSS_SCRIPT_TAG");
    }

    // Check for javascript: URI scheme
    if (/javascript\s*:/gi.test(input)) {
      threatsDetected.push("XSS_JAVASCRIPT_URI");
    }

    // Check for event handler attributes (onerror, onload, onclick)
    if (/on\w+\s*=/gi.test(input)) {
      threatsDetected.push("XSS_EVENT_HANDLER");
    }

    // Check for NoSQL / SQL injection keywords
    if (/(\$where|\$gt|\$lt|\$ne|UNION\s+SELECT|DROP\s+TABLE|SELECT\s+\*)/gi.test(input)) {
      threatsDetected.push("INJECTION_KEYWORD");
    }

    // Escape basic HTML characters
    const sanitizedValue = input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");

    return {
      isValid: threatsDetected.length === 0,
      sanitizedValue,
      threatsDetected,
    };
  }

  /**
   * AI Prompt Injection Defense
   * Scans user prompts for jailbreaks, instructions overrides, system prompt leaks, and role switching.
   */
  public static detectPromptInjection(promptText: string): { isSuspicious: boolean; reason?: string } {
    if (!promptText || typeof promptText !== "string") {
      return { isSuspicious: false };
    }

    const injectionPatterns = [
      /ignore\s+all\s+previous\s+instructions/i,
      /disregard\s+the\s+above\s+instructions/i,
      /you\s+are\s+now\s+in\s+DAN\s+mode/i,
      /forget\s+everything\s+you\s+were\s+told/i,
      /system\s+prompt\s+override/i,
      /reveal\s+your\s+system\s+prompt/i,
      /print\s+the\s+initial\s+instructions/i,
      /bypass\s+safety\s+filter/i,
    ];

    for (const pattern of injectionPatterns) {
      if (pattern.test(promptText)) {
        return {
          isSuspicious: true,
          reason: `Detected potential AI prompt injection pattern: ${pattern.source}`,
        };
      }
    }

    return { isSuspicious: false };
  }

  /**
   * Secret & PII Log Sanitizer
   * Removes passwords, JWT tokens, API keys, credit cards, and auth headers before logging.
   */
  public static maskSensitiveData(data: any): any {
    if (!data) return data;

    if (typeof data === "string") {
      return data
        .replace(/("password"|"secret"|"apiKey"|"token"|"authorization")\s*:\s*["'][^"']+["']/gi, '$1: "[REDACTED]"')
        .replace(/Bearer\s+[A-Za-z0-9\-_=]+\.[A-Za-z0-9\-_=]+\.?[A-Za-z0-9\-_=]*/gi, "Bearer [REDACTED_JWT]")
        .replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, "****-****-****-****");
    }

    if (typeof data === "object") {
      const sanitized = Array.isArray(data) ? [...data] : { ...data };
      const sensitiveKeys = ["password", "token", "apiKey", "secret", "authorization", "cvv", "creditCard"];

      for (const key of Object.keys(sanitized)) {
        if (sensitiveKeys.some((k) => key.toLowerCase().includes(k))) {
          sanitized[key] = "[REDACTED]";
        } else if (typeof sanitized[key] === "object") {
          sanitized[key] = this.maskSensitiveData(sanitized[key]);
        }
      }
      return sanitized;
    }

    return data;
  }

  /**
   * File Upload Security Validator
   * Checks file extension, MIME type, and max size boundaries.
   */
  public static validateFileUpload(
    fileName: string,
    mimeType: string,
    sizeBytes: number,
    maxMB: number = 5
  ): { isAllowed: boolean; reason?: string } {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "application/pdf",
    ];

    const maxBytes = maxMB * 1024 * 1024;
    if (sizeBytes > maxBytes) {
      return { isAllowed: false, reason: `File size exceeds max limit of ${maxMB}MB` };
    }

    if (!allowedMimeTypes.includes(mimeType.toLowerCase())) {
      return { isAllowed: false, reason: `Disallowed MIME type: ${mimeType}` };
    }

    // Check executable extensions
    const dangerousExtensions = [".exe", ".sh", ".bat", ".cmd", ".js", ".php", ".py", ".html", ".htm"];
    const ext = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
    if (dangerousExtensions.includes(ext)) {
      return { isAllowed: false, reason: `Dangerous file extension detected: ${ext}` };
    }

    return { isAllowed: true };
  }

  /**
   * Security Headers Generator
   * Returns enterprise HTTP security headers.
   */
  public static getSecurityHeaders(): Record<string, string> {
    return {
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
      "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https:;",
    };
  }
}
