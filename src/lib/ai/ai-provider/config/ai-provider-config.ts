import { AIModelConfig, GeminiModelId } from "../types";

export class AIProviderConfig {
  public static readonly defaultProvider = "gemini";
  public static readonly defaultGeminiModel: GeminiModelId = "gemini-2.0-flash";

  public static readonly defaultModelConfig: AIModelConfig = {
    model: "gemini-2.0-flash",
    temperature: 0.3,
    maxOutputTokens: 8192,
    topP: 0.95,
    topK: 40,
    responseMimeType: "application/json"
  };

  public static readonly requestLimits = {
    maxTimeoutMs: 60000,
    defaultTimeoutMs: 30000,
    maxRetries: 3,
    backoffMs: 1000,
    maxTokensPerMinute: 200000,
    maxRequestsPerMinute: 60
  };

  // Cost estimates per 1,000,000 tokens (USD)
  public static readonly pricingTable: Record<string, { inputPer1M: number; outputPer1M: number }> = {
    "gemini-2.0-flash": { inputPer1M: 0.10, outputPer1M: 0.40 },
    "gemini-1.5-pro": { inputPer1M: 1.25, outputPer1M: 5.00 },
    "gemini-1.5-flash": { inputPer1M: 0.075, outputPer1M: 0.30 },
    "gemini-1.0-pro": { inputPer1M: 0.50, outputPer1M: 1.50 },
    "gpt-4o": { inputPer1M: 2.50, outputPer1M: 10.00 },
    "claude-3-5-sonnet": { inputPer1M: 3.00, outputPer1M: 15.00 }
  };

  // Dangerous injection patterns to block
  public static readonly injectionBlocklist = [
    "ignore previous instructions",
    "ignore all previous instructions",
    "system override",
    "jailbreak",
    "act as DAN",
    "bypass safety filters",
    "reveal internal instructions"
  ];
}
