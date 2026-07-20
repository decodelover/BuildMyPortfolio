import { TokenUsage } from "../types";
import { AIProviderConfig } from "../config/ai-provider-config";

export class TokenManager {
  /**
   * Fast approximation of token count based on word/character heuristic (avg ~4 chars per token for English text & JSON)
   */
  public static estimateTokenCount(text: string): number {
    if (!text) return 0;
    return Math.ceil(text.length / 4);
  }

  public static calculateCost(model: string, inputTokens: number, outputTokens: number): number {
    const rates = AIProviderConfig.pricingTable[model] || AIProviderConfig.pricingTable["gemini-2.0-flash"];
    const inputCost = (inputTokens / 1000000) * rates.inputPer1M;
    const outputCost = (outputTokens / 1000000) * rates.outputPer1M;
    return Math.round((inputCost + outputCost) * 1000000) / 1000000;
  }

  public static createTokenUsage(
    model: string,
    promptText: string,
    responseText: string,
    actualInputTokens?: number,
    actualOutputTokens?: number
  ): TokenUsage {
    const inputTokens = actualInputTokens ?? this.estimateTokenCount(promptText);
    const outputTokens = actualOutputTokens ?? this.estimateTokenCount(responseText);
    const totalTokens = inputTokens + outputTokens;
    const estimatedCostUsd = this.calculateCost(model, inputTokens, outputTokens);

    return {
      inputTokens,
      outputTokens,
      totalTokens,
      estimatedCostUsd
    };
  }
}
