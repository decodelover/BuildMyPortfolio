import { create } from "zustand";
import { SEOBlueprint, SeoPipelineStatus, SeoScores } from "@/lib/ai/seo-agent/types";
import { SeoPipeline } from "@/lib/ai/seo-agent/pipeline/seo-pipeline";

export interface SeoAgentStoreState {
  pipelineStatus: SeoPipelineStatus;
  progress: number;
  metadata: any | null;
  structuredData: any | null;
  social: any | null;
  urlRules: any | null;
  contentAnalysis: any | null;
  technicalRules: any | null;
  accessibility: any | null;
  seoScores: SeoScores | null;
  blueprintResult: SEOBlueprint | null;
  error: string | null;
  logs: string[];
  
  // Actions
  executePipeline: (
    userId: string,
    builderId: string,
    planId: string,
    rawInput: Record<string, any>,
    contentBlocks?: any[],
    designBlueprint?: any
  ) => Promise<SEOBlueprint | null>;
  resetAgent: () => void;
}

export const useSeoAgentStore = create<SeoAgentStoreState>((set) => ({
  pipelineStatus: "idle",
  progress: 0,
  metadata: null,
  structuredData: null,
  social: null,
  urlRules: null,
  contentAnalysis: null,
  technicalRules: null,
  accessibility: null,
  seoScores: null,
  blueprintResult: null,
  error: null,
  logs: [],

  executePipeline: async (userId, builderId, planId, rawInput, contentBlocks = [], designBlueprint) => {
    set({
      pipelineStatus: "idle",
      progress: 0,
      metadata: null,
      structuredData: null,
      social: null,
      urlRules: null,
      contentAnalysis: null,
      technicalRules: null,
      accessibility: null,
      seoScores: null,
      blueprintResult: null,
      error: null,
      logs: ["Initializing SEO Agent..."]
    });

    const pipeline = new SeoPipeline();

    try {
      const result = await pipeline.run(
        userId,
        builderId,
        planId,
        rawInput,
        contentBlocks,
        designBlueprint,
        {
          onStatusChange: (status) => {
            set({ pipelineStatus: status });
            set((state) => ({ logs: [...state.logs, `SEO pipeline status: ${status}`] }));
          },
          onProgress: (progress) => {
            set({ progress });
          }
        }
      );

      set({
        metadata: result.metadata,
        structuredData: result.structuredData,
        social: result.social,
        urlRules: result.urlRules,
        contentAnalysis: result.contentAnalysis,
        technicalRules: result.technicalRules,
        accessibility: result.accessibility,
        seoScores: result.scores,
        blueprintResult: result,
        logs: [...getLogsArray(), "SEO blueprint generated successfully."]
      });

      return result;
    } catch (err: any) {
      set({
        pipelineStatus: "failed",
        error: err.message || "SEO generation pipeline failed."
      });
      set((state) => ({ logs: [...state.logs, `SEO execution error: ${err.message}`] }));
      return null;
    }
  },

  resetAgent: () => {
    set({
      pipelineStatus: "idle",
      progress: 0,
      metadata: null,
      structuredData: null,
      social: null,
      urlRules: null,
      contentAnalysis: null,
      technicalRules: null,
      accessibility: null,
      seoScores: null,
      blueprintResult: null,
      error: null,
      logs: []
    });
  }
}));

// Helper to safely access logs array state
function getLogsArray() {
  return useSeoAgentStore.getState().logs;
}
