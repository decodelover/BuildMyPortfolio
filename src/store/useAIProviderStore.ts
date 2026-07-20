import { create } from "zustand";
import { AIResponse, TokenUsage, AIMetrics } from "@/lib/ai/ai-provider/types";
import { AIMetricsCollector } from "@/lib/ai/ai-provider/metrics/ai-metrics-collector";

export interface AIProviderStoreState {
  currentRequestId: string | null;
  streamingText: string;
  isStreaming: boolean;
  loading: boolean;
  lastResponse: AIResponse | null;
  cumulativeTokens: TokenUsage;
  metrics: AIMetrics;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setStreaming: (isStreaming: boolean, requestId?: string) => void;
  appendStreamChunk: (chunk: string) => void;
  recordResponse: (response: AIResponse) => void;
  setError: (error: string | null) => void;
  resetStore: () => void;
}

export const useAIProviderStore = create<AIProviderStoreState>((set, get) => ({
  currentRequestId: null,
  streamingText: "",
  isStreaming: false,
  loading: false,
  lastResponse: null,
  cumulativeTokens: {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    estimatedCostUsd: 0
  },
  metrics: AIMetricsCollector.getInstance().getMetrics(),
  error: null,

  setLoading: (loading: boolean) => set({ loading }),

  setStreaming: (isStreaming: boolean, requestId?: string) => {
    set({
      isStreaming,
      currentRequestId: requestId || null,
      streamingText: isStreaming ? "" : get().streamingText
    });
  },

  appendStreamChunk: (chunk: string) => {
    set((state) => ({ streamingText: state.streamingText + chunk }));
  },

  recordResponse: (response: AIResponse) => {
    set((state) => ({
      lastResponse: response,
      loading: false,
      isStreaming: false,
      error: null,
      cumulativeTokens: {
        inputTokens: state.cumulativeTokens.inputTokens + response.tokens.inputTokens,
        outputTokens: state.cumulativeTokens.outputTokens + response.tokens.outputTokens,
        totalTokens: state.cumulativeTokens.totalTokens + response.tokens.totalTokens,
        estimatedCostUsd: Math.round((state.cumulativeTokens.estimatedCostUsd + response.tokens.estimatedCostUsd) * 10000) / 10000
      },
      metrics: AIMetricsCollector.getInstance().getMetrics()
    }));
  },

  setError: (error: string | null) => set({ error, loading: false, isStreaming: false }),

  resetStore: () => set({
    currentRequestId: null,
    streamingText: "",
    isStreaming: false,
    loading: false,
    lastResponse: null,
    error: null
  })
}));
