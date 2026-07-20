import { StructuredLogger } from "../../orchestrator/logger";
import { TokenUsage } from "../types";

export class AILogger extends StructuredLogger {
  constructor(jobId?: string) {
    super(jobId);
  }

  public requestStarted(requestId: string, provider: string, model: string, promptId?: string): void {
    this.info(`AI Request started [${requestId}] - Provider: ${provider}, Model: ${model}${promptId ? `, Prompt: ${promptId}` : ""}`);
  }

  public requestCompleted(requestId: string, provider: string, durationMs: number, tokens: TokenUsage): void {
    this.info(`AI Request completed [${requestId}] in ${durationMs}ms - Tokens: In=${tokens.inputTokens}, Out=${tokens.outputTokens}, Total=${tokens.totalTokens}, EstCost=$${tokens.estimatedCostUsd.toFixed(6)}`);
  }

  public requestFailed(requestId: string, provider: string, error: Error): void {
    this.error(`AI Request failed [${requestId}] - Provider: ${provider}, Error: ${error.message}`, undefined, { stack: error.stack });
  }

  public streamChunkReceived(requestId: string, chunkSize: number, accumulatedSize: number): void {
    this.debug(`AI Stream chunk received [${requestId}] - Chunk: ${chunkSize} chars, Total: ${accumulatedSize} chars`);
  }

  public retryAttempted(requestId: string, attempt: number, maxRetries: number, delayMs: number, reason: string): void {
    this.warn(`Retrying AI Request [${requestId}] - Attempt ${attempt}/${maxRetries} in ${delayMs}ms. Reason: ${reason}`);
  }

  public safetyViolation(requestId: string, violationDetails: string): void {
    this.warn(`AI Safety Filter Triggered [${requestId}] - Details: ${violationDetails}`);
  }
}
