import { AIRateLimitError } from "../errors/ai-provider-errors";
import { AIProviderConfig } from "../config/ai-provider-config";

export class AIRateLimiter {
  private static requestTimestamps: number[] = [];

  public static checkRateLimit(provider: string = "gemini"): void {
    const now = Date.now();
    const windowMs = 60000; // 1 minute window

    // Filter timestamps within the current 1-minute window
    this.requestTimestamps = this.requestTimestamps.filter((ts) => now - ts < windowMs);

    if (this.requestTimestamps.length >= AIProviderConfig.requestLimits.maxRequestsPerMinute) {
      throw new AIRateLimitError(
        `Rate limit exceeded: Max ${AIProviderConfig.requestLimits.maxRequestsPerMinute} requests/min allowed for ${provider}.`,
        provider,
        { activeRequestsInWindow: this.requestTimestamps.length }
      );
    }

    this.requestTimestamps.push(now);
  }
}
