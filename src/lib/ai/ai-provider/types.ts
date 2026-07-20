// ─────────────────────────────────────────────────────────────────────────────
// AI Provider Identifiers
// ─────────────────────────────────────────────────────────────────────────────

export type AIProviderId = "gemini" | "openai" | "claude" | "deepseek" | "grok" | "mistral" | "mock";

// ─────────────────────────────────────────────────────────────────────────────
// Supported Models
// ─────────────────────────────────────────────────────────────────────────────

export type GeminiModelId =
  | "gemini-2.0-flash"
  | "gemini-1.5-pro"
  | "gemini-1.5-flash"
  | "gemini-1.0-pro";

export type AIModelId = GeminiModelId | string;

// ─────────────────────────────────────────────────────────────────────────────
// Request Options & Configuration
// ─────────────────────────────────────────────────────────────────────────────

export interface AIModelConfig {
  model: AIModelId;
  temperature?: number; // 0.0 to 1.0
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
  responseMimeType?: "application/json" | "text/plain";
  systemInstruction?: string;
  stopSequences?: string[];
}

export interface AIRequestOptions {
  requestId?: string;
  promptId?: string;
  provider?: AIProviderId;
  config?: Partial<AIModelConfig>;
  timeoutMs?: number;
  maxRetries?: number;
  enableSafetyChecks?: boolean;
  enableCache?: boolean;
  metadata?: Record<string, any>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Token & Cost Usage
// ─────────────────────────────────────────────────────────────────────────────

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Standardized AI Response
// ─────────────────────────────────────────────────────────────────────────────

export type AIValidationStatus = "valid" | "warning" | "invalid";

export interface AIResponse<T = any> {
  provider: AIProviderId;
  model: string;
  promptId: string;
  requestId: string;
  executionTimeMs: number;
  tokens: TokenUsage;
  rawResponse: string;
  parsedResponse: T;
  validationStatus: AIValidationStatus;
  warnings: string[];
  errors: string[];
  metadata: Record<string, any>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Streaming Types
// ─────────────────────────────────────────────────────────────────────────────

export interface StreamChunk {
  requestId: string;
  chunkText: string;
  accumulatedText: string;
  isFinished: boolean;
  tokens?: TokenUsage;
}

export type StreamProgressCallback = (chunk: StreamChunk) => void;

// ─────────────────────────────────────────────────────────────────────────────
// Conversation & Memory Types
// ─────────────────────────────────────────────────────────────────────────────

export type ChatRole = "user" | "model" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  tokens?: number;
}

export interface ConversationSession {
  sessionId: string;
  userId: string;
  messages: ChatMessage[];
  totalTokens: number;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Metrics & Statistics
// ─────────────────────────────────────────────────────────────────────────────

export interface AIMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalTokensProcessed: number;
  totalEstimatedCostUsd: number;
  averageLatencyMs: number;
  modelUsage: Record<string, number>;
  providerUsage: Record<string, number>;
}
