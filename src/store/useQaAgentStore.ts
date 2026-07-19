import { create } from "zustand";
import { QualityReport, QAPipelineStatus, QAScores } from "@/lib/ai/qa-agent/types";
import { QaPipeline } from "@/lib/ai/qa-agent/pipeline/qa-pipeline";

export interface QaAgentStoreState {
  pipelineStatus: QAPipelineStatus;
  progress: number;
  qualityReport: QualityReport | null;
  scores: QAScores | null;
  error: string | null;
  logs: string[];

  // Actions
  executePipeline: (
    userId: string,
    builderId: string,
    planId: string,
    rawInput: Record<string, any>,
    contentBlocks?: any[],
    designBlueprint?: any,
    seoBlueprint?: any
  ) => Promise<QualityReport | null>;
  resetAgent: () => void;
}

export const useQaAgentStore = create<QaAgentStoreState>((set) => ({
  pipelineStatus: "idle",
  progress: 0,
  qualityReport: null,
  scores: null,
  error: null,
  logs: [],

  executePipeline: async (
    userId,
    builderId,
    planId,
    rawInput,
    contentBlocks = [],
    designBlueprint,
    seoBlueprint
  ) => {
    set({
      pipelineStatus: "idle",
      progress: 0,
      qualityReport: null,
      scores: null,
      error: null,
      logs: ["Initializing Quality Assurance Agent..."]
    });

    const pipeline = new QaPipeline();

    try {
      const result = await pipeline.run(
        userId,
        builderId,
        planId,
        rawInput,
        contentBlocks,
        designBlueprint,
        seoBlueprint,
        {
          onStatusChange: (status) => {
            set({ pipelineStatus: status });
            set((state) => ({ logs: [...state.logs, `QA pipeline status: ${status}`] }));
          },
          onProgress: (progress) => {
            set({ progress });
          }
        }
      );

      set({
        qualityReport: result,
        scores: result.scores,
        logs: [...getLogsArray(), "QA quality report compiled successfully."]
      });

      return result;
    } catch (err: any) {
      set({
        pipelineStatus: "failed",
        error: err.message || "QA validation pipeline failed."
      });
      set((state) => ({ logs: [...state.logs, `QA execution error: ${err.message}`] }));
      return null;
    }
  },

  resetAgent: () => {
    set({
      pipelineStatus: "idle",
      progress: 0,
      qualityReport: null,
      scores: null,
      error: null,
      logs: []
    });
  }
}));

// Helper to safely access logs array state
function getLogsArray() {
  return useQaAgentStore.getState().logs;
}
