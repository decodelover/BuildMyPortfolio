const PROMPT_INJECTION_KEYWORDS = [
  "ignore all previous instructions",
  "system prompt",
  "disregard",
  "you are now a",
  "override",
  "do not follow",
  "instead, write",
  "prompt injection"
];

export function sanitizeText(text: string): string {
  if (!text) return "";
  
  // Basic HTML entity escaping to prevent cross-site scripting (XSS)
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export function sanitizeURL(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  
  // Block javascript: or data: protocols
  if (/^(javascript:|data:|vbscript:)/i.test(trimmed)) {
    return "";
  }
  return trimmed;
}

export function detectPromptInjection(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return PROMPT_INJECTION_KEYWORDS.some((keyword) => lower.includes(keyword));
}

export function sanitizePortfolioData<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    // If it's a URL-like key or value, sanitize as URL, else sanitize text
    return sanitizeText(obj) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizePortfolioData(item)) as unknown as T;
  }

  if (typeof obj === "object") {
    const copy = { ...obj } as Record<string, any>;
    for (const key of Object.keys(copy)) {
      const val = copy[key];
      // Normalize specific fields (e.g. URLs) using URL sanitizer
      if (typeof val === "string" && (key.toLowerCase().includes("url") || key.toLowerCase().includes("link"))) {
        copy[key] = sanitizeURL(val);
      } else {
        copy[key] = sanitizePortfolioData(val);
      }
    }
    return copy as unknown as T;
  }

  return obj;
}
