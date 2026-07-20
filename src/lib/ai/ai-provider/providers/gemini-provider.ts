import { GoogleGenerativeAI } from "@google/generative-ai";
import { IAIProvider } from "./provider-interface";
import { AIProviderId, AIRequestOptions, AIResponse, StreamProgressCallback } from "../types";
import { AIProviderConfig } from "../config/ai-provider-config";
import { AILogger } from "../logging/ai-logger";
import { SafetyFilter } from "../safety/safety-filter";
import { ResponseParser } from "../services/response-parser";
import { ResponseValidator } from "../safety/response-validator";
import { TokenManager } from "../services/token-manager";
import { AIRateLimiter } from "../services/rate-limiter";
import { AIRetryManager } from "../services/retry-manager";
import { AIMetricsCollector } from "../metrics/ai-metrics-collector";
import { StreamingEngine } from "../services/streaming-engine";
import { AIProviderError } from "../errors/ai-provider-errors";

export class GeminiProvider implements IAIProvider {
  public readonly id: AIProviderId = "gemini";
  public readonly name: string = "Google Gemini Provider";
  public readonly defaultModel: string = AIProviderConfig.defaultGeminiModel;
  public readonly supportedModels: string[] = [
    "gemini-2.0-flash",
    "gemini-1.5-pro",
    "gemini-1.5-flash",
    "gemini-1.0-pro"
  ];

  public isConfigured(): boolean {
    return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "");
  }

  public async generateContent<T = any>(
    prompt: string,
    options: AIRequestOptions = {}
  ): Promise<AIResponse<T>> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new AIProviderError("GEMINI_API_KEY is missing in server environment variables.", "GEMINI_MISSING_KEY", this.id);
    }

    const requestId = options.requestId || `req-gemini-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const promptId = options.promptId || "custom-prompt";
    const logger = new AILogger(requestId);
    const metrics = AIMetricsCollector.getInstance();

    const mergedConfig = {
      ...AIProviderConfig.defaultModelConfig,
      ...options.config
    };

    const selectedModel = mergedConfig.model || this.defaultModel;
    logger.requestStarted(requestId, this.id, selectedModel, promptId);

    // 1. Safety Filter Prompt Inspection
    if (options.enableSafetyChecks !== false) {
      SafetyFilter.inspectPrompt(prompt);
    }

    // 2. Rate Limiting Check
    AIRateLimiter.checkRateLimit(this.id);

    const startTime = Date.now();

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const modelInstance = genAI.getGenerativeModel({
        model: selectedModel,
        systemInstruction: mergedConfig.systemInstruction,
        generationConfig: {
          temperature: mergedConfig.temperature,
          maxOutputTokens: mergedConfig.maxOutputTokens,
          topP: mergedConfig.topP,
          topK: mergedConfig.topK,
          responseMimeType: mergedConfig.responseMimeType
        }
      });

      // 3. Execute request with retries
      const rawResult = await AIRetryManager.executeWithRetry(
        () => modelInstance.generateContent(prompt),
        this.id,
        requestId,
        options.maxRetries || AIProviderConfig.requestLimits.maxRetries,
        logger
      );

      const durationMs = Date.now() - startTime;
      const rawText = rawResult.response.text();
      const sanitizedText = SafetyFilter.sanitizeOutput(rawText);

      // 4. Token & Cost calculation
      const usageMetadata = rawResult.response.usageMetadata;
      const tokens = TokenManager.createTokenUsage(
        selectedModel,
        prompt,
        sanitizedText,
        usageMetadata?.promptTokenCount,
        usageMetadata?.candidatesTokenCount
      );

      // 5. Response Parsing & Validation
      let parsedData: T = null as unknown as T;
      let valStatus: "valid" | "warning" | "invalid" = "valid";
      let warnings: string[] = [];
      let errors: string[] = [];

      if (mergedConfig.responseMimeType === "application/json") {
        try {
          parsedData = ResponseParser.parseJSON<T>(sanitizedText, this.id);
          const validation = ResponseValidator.validateJSON(sanitizedText);
          valStatus = validation.status;
          warnings = validation.warnings;
          errors = validation.errors;
        } catch (parseErr: any) {
          valStatus = "invalid";
          errors.push(parseErr.message);
        }
      } else {
        parsedData = sanitizedText as unknown as T;
      }

      logger.requestCompleted(requestId, this.id, durationMs, tokens);
      metrics.recordSuccess(this.id, selectedModel, durationMs, tokens);

      return {
        provider: this.id,
        model: selectedModel,
        promptId,
        requestId,
        executionTimeMs: durationMs,
        tokens,
        rawResponse: sanitizedText,
        parsedResponse: parsedData,
        validationStatus: valStatus,
        warnings,
        errors,
        metadata: {
          ...options.metadata,
          finishReason: rawResult.response.candidates?.[0]?.finishReason || "STOP"
        }
      };

    } catch (err: any) {
      metrics.recordFailure(this.id, selectedModel);
      logger.requestFailed(requestId, this.id, err);
      throw new AIProviderError(`Gemini generation failed: ${err.message}`, "GEMINI_EXECUTION_ERROR", this.id, { cause: err });
    }
  }

  public async generateStream(
    prompt: string,
    onProgress: StreamProgressCallback,
    options: AIRequestOptions = {}
  ): Promise<AIResponse<string>> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new AIProviderError("GEMINI_API_KEY is missing in server environment variables.", "GEMINI_MISSING_KEY", this.id);
    }

    const requestId = options.requestId || `req-stream-gemini-${Date.now()}`;
    const promptId = options.promptId || "stream-prompt";
    const logger = new AILogger(requestId);
    const metrics = AIMetricsCollector.getInstance();

    const mergedConfig = {
      ...AIProviderConfig.defaultModelConfig,
      ...options.config
    };

    const selectedModel = mergedConfig.model || this.defaultModel;
    logger.requestStarted(requestId, this.id, selectedModel, promptId);

    if (options.enableSafetyChecks !== false) {
      SafetyFilter.inspectPrompt(prompt);
    }

    AIRateLimiter.checkRateLimit(this.id);
    const startTime = Date.now();

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const modelInstance = genAI.getGenerativeModel({
        model: selectedModel,
        systemInstruction: mergedConfig.systemInstruction,
        generationConfig: {
          temperature: mergedConfig.temperature,
          maxOutputTokens: mergedConfig.maxOutputTokens,
          topP: mergedConfig.topP,
          topK: mergedConfig.topK
        }
      });

      const streamResult = await modelInstance.generateContentStream(prompt);
      const { fullText, tokens } = await StreamingEngine.processStream(
        streamResult.stream,
        requestId,
        selectedModel,
        prompt,
        onProgress
      );

      const durationMs = Date.now() - startTime;
      logger.requestCompleted(requestId, this.id, durationMs, tokens);
      metrics.recordSuccess(this.id, selectedModel, durationMs, tokens);

      return {
        provider: this.id,
        model: selectedModel,
        promptId,
        requestId,
        executionTimeMs: durationMs,
        tokens,
        rawResponse: fullText,
        parsedResponse: fullText,
        validationStatus: "valid",
        warnings: [],
        errors: [],
        metadata: { ...options.metadata }
      };

    } catch (err: any) {
      metrics.recordFailure(this.id, selectedModel);
      logger.requestFailed(requestId, this.id, err);
      throw new AIProviderError(`Gemini stream generation failed: ${err.message}`, "GEMINI_STREAM_ERROR", this.id);
    }
  }
}
