import { AIProviderConfig } from "../config/ai-provider-config";
import { AILogger } from "../logging/ai-logger";

export class AIRetryManager {
  public static async executeWithRetry<T>(
    fn: () => Promise<T>,
    provider: string,
    requestId: string,
    maxRetries: number = AIProviderConfig.requestLimits.maxRetries,
    logger?: AILogger
  ): Promise<T> {
    let attempt = 0;
    let lastError: any = null;

    while (attempt < maxRetries) {
      attempt++;
      try {
        return await fn();
      } catch (err: any) {
        lastError = err;
        const isRateLimit = err?.message?.includes("429") || err?.code === "AI_RATE_LIMIT_ERROR";
        const isTransient = isRateLimit || err?.message?.includes("fetch") || err?.message?.includes("timeout");

        if (!isTransient || attempt >= maxRetries) {
          throw err;
        }

        const delayMs = AIProviderConfig.requestLimits.backoffMs * Math.pow(2, attempt - 1);
        if (logger) {
          logger.retryAttempted(requestId, attempt, maxRetries, delayMs, err.message);
        }

        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    throw lastError;
  }
}
