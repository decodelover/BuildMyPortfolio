import { create } from "zustand";
import { DesignBlueprint, DesignPipelineStatus, DesignScore } from "@/lib/ai/design-agent/types";
import { DesignPipeline } from "@/lib/ai/design-agent/pipeline/design-pipeline";

export interface DesignAgentStoreState {
  pipelineStatus: DesignPipelineStatus;
  progress: number;
  themeDecision: any | null;
  layoutDecisions: any[];
  componentDecisions: any[];
  animationDecisions: any | null;
  responsiveDecisions: any | null;
  accessibilityDecisions: any | null;
  designScores: DesignScore | null;
  blueprintResult: DesignBlueprint | null;
  error: string | null;
  logs: string[];
  
  // Actions
  executePipeline: (
    userId: string,
    builderId: string,
    planId: string,
    rawInput: Record<string, any>,
    contentBlocks?: any[]
  ) => Promise<DesignBlueprint | null>;
  resetAgent: () => void;
}

export const useDesignAgentStore = create<DesignAgentStoreState>((set) => ({
  pipelineStatus: "idle",
  progress: 0,
  themeDecision: null,
  layoutDecisions: [],
  componentDecisions: [],
  animationDecisions: null,
  responsiveDecisions: null,
  accessibilityDecisions: null,
  designScores: null,
  blueprintResult: null,
  error: null,
  logs: [],

  executePipeline: async (userId, builderId, planId, rawInput, contentBlocks = []) => {
    set({
      pipelineStatus: "idle",
      progress: 0,
      themeDecision: null,
      layoutDecisions: [],
      componentDecisions: [],
      animationDecisions: null,
      responsiveDecisions: null,
      accessibilityDecisions: null,
      designScores: null,
      blueprintResult: null,
      error: null,
      logs: ["Initializing Design Agent..."]
    });

    const pipeline = new DesignPipeline();

    try {
      const result = await pipeline.run(
        userId,
        builderId,
        planId,
        rawInput,
        contentBlocks,
        {
          onStatusChange: (status) => {
            set({ pipelineStatus: status });
            set((state) => ({ logs: [...state.logs, `Design pipeline status: ${status}`] }));
          },
          onProgress: (progress) => {
            set({ progress });
          }
        }
      );

      set({
        themeDecision: result.theme,
        layoutDecisions: result.layouts,
        componentDecisions: result.components,
        animationDecisions: result.animations,
        responsiveDecisions: result.responsive,
        accessibilityDecisions: result.accessibility,
        designScores: result.scores,
        blueprintResult: result,
        logs: [...getLogsArray(), "Design blueprint generated successfully."]
      });

      return result;
    } catch (err: any) {
      set({
        pipelineStatus: "failed",
        error: err.message || "Design generation pipeline failed."
      });
      set((state) => ({ logs: [...state.logs, `Design execution error: ${err.message}`] }));
      return null;
    }
  },

  resetAgent: () => {
    set({
      pipelineStatus: "idle",
      progress: 0,
      themeDecision: null,
      layoutDecisions: [],
      componentDecisions: [],
      animationDecisions: null,
      responsiveDecisions: null,
      accessibilityDecisions: null,
      designScores: null,
      blueprintResult: null,
      error: null,
      logs: []
    });
  }
}));

// Helper to safely access logs array state
function getLogsArray() {
  return useDesignAgentStore.getState().logs;
}
