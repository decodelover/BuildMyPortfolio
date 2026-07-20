import { AIMetrics, TokenUsage } from "../types";

export class AIMetricsCollector {
  private static instance: AIMetricsCollector | null = null;

  private totalRequests = 0;
  private successfulRequests = 0;
  private failedRequests = 0;
  private totalTokensProcessed = 0;
  private totalEstimatedCostUsd = 0;
  private totalLatencyMs = 0;
  private modelUsage: Record<string, number> = {};
  private providerUsage: Record<string, number> = {};

  private constructor() {}

  public static getInstance(): AIMetricsCollector {
    if (!AIMetricsCollector.instance) {
      AIMetricsCollector.instance = new AIMetricsCollector();
    }
    return AIMetricsCollector.instance;
  }

  public recordSuccess(provider: string, model: string, durationMs: number, tokens: TokenUsage): void {
    this.totalRequests++;
    this.successfulRequests++;
    this.totalLatencyMs += durationMs;
    this.totalTokensProcessed += tokens.totalTokens;
    this.totalEstimatedCostUsd += tokens.estimatedCostUsd;

    this.modelUsage[model] = (this.modelUsage[model] || 0) + 1;
    this.providerUsage[provider] = (this.providerUsage[provider] || 0) + 1;
  }

  public recordFailure(provider: string, model: string): void {
    this.totalRequests++;
    this.failedRequests++;
    this.modelUsage[model] = (this.modelUsage[model] || 0) + 1;
    this.providerUsage[provider] = (this.providerUsage[provider] || 0) + 1;
  }

  public getMetrics(): AIMetrics {
    return {
      totalRequests: this.totalRequests,
      successfulRequests: this.successfulRequests,
      failedRequests: this.failedRequests,
      totalTokensProcessed: this.totalTokensProcessed,
      totalEstimatedCostUsd: Math.round(this.totalEstimatedCostUsd * 10000) / 10000,
      averageLatencyMs: this.successfulRequests > 0 ? Math.round(this.totalLatencyMs / this.successfulRequests) : 0,
      modelUsage: { ...this.modelUsage },
      providerUsage: { ...this.providerUsage }
    };
  }

  public reset(): void {
    this.totalRequests = 0;
    this.successfulRequests = 0;
    this.failedRequests = 0;
    this.totalTokensProcessed = 0;
    this.totalEstimatedCostUsd = 0;
    this.totalLatencyMs = 0;
    this.modelUsage = {};
    this.providerUsage = {};
  }
}
