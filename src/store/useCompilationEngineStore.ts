import { create } from "zustand";
import { PortfolioBlueprint, CompilationPipelineStatus, BlueprintNode, AssetRef } from "@/lib/ai/compilation-engine/types";
import { CompilationPipeline } from "@/lib/ai/compilation-engine/pipeline/compilation-pipeline";

export interface CompilationEngineStoreState {
  pipelineStatus: CompilationPipelineStatus;
  progress: number;
  stageName: string;
  blueprint: PortfolioBlueprint | null;
  compiledSections: BlueprintNode[];
  compiledAssets: AssetRef[];
  warnings: string[];
  errors: string[];
  logs: string[];
  loading: boolean;

  // Actions
  executePipeline: (
    userId: string,
    builderId: string,
    planId: string,
    rawInput: Record<string, any>,
    contentBlocks?: any[],
    designBlueprint?: any,
    seoBlueprint?: any,
    qualityReport?: any
  ) => Promise<PortfolioBlueprint | null>;
  resetEngine: () => void;
}

export const useCompilationEngineStore = create<CompilationEngineStoreState>((set) => ({
  pipelineStatus: "idle",
  progress: 0,
  stageName: "",
  blueprint: null,
  compiledSections: [],
  compiledAssets: [],
  warnings: [],
  errors: [],
  logs: [],
  loading: false,

  executePipeline: async (
    userId,
    builderId,
    planId,
    rawInput,
    contentBlocks = [],
    designBlueprint,
    seoBlueprint,
    qualityReport
  ) => {
    set({
      pipelineStatus: "processing_input",
      progress: 0,
      stageName: "Input Processing",
      blueprint: null,
      compiledSections: [],
      compiledAssets: [],
      warnings: [],
      errors: [],
      logs: ["Initializing Portfolio Compilation Engine..."],
      loading: true
    });

    try {
      const result = await CompilationPipeline.execute(
        {
          userId,
          builderId,
          planId,
          rawInput,
          contentBlocks,
          designBlueprint,
          seoBlueprint,
          qualityReport
        },
        (evt) => {
          set((state) => ({
            pipelineStatus: evt.status,
            progress: evt.progress,
            stageName: evt.stageName,
            logs: [...state.logs, `[${evt.stageName}] ${evt.message}`]
          }));
        }
      );

      if (result.success && result.blueprint) {
        set({
          blueprint: result.blueprint,
          compiledSections: result.blueprint.sections,
          compiledAssets: result.blueprint.assets,
          warnings: result.warnings,
          pipelineStatus: "completed",
          progress: 100,
          loading: false,
          logs: [...useCompilationEngineStore.getState().logs, "Portfolio blueprint compiled successfully."]
        });
        return result.blueprint;
      } else {
        set({
          pipelineStatus: "failed",
          errors: result.errors,
          warnings: result.warnings,
          loading: false,
          logs: [...useCompilationEngineStore.getState().logs, `Compilation failed: ${result.errors.join("; ")}`]
        });
        return null;
      }
    } catch (err: any) {
      const msg = err.message || "Unexpected portfolio compilation failure.";
      set({
        pipelineStatus: "failed",
        errors: [msg],
        loading: false,
        logs: [...useCompilationEngineStore.getState().logs, `Compilation exception: ${msg}`]
      });
      return null;
    }
  },

  resetEngine: () => {
    set({
      pipelineStatus: "idle",
      progress: 0,
      stageName: "",
      blueprint: null,
      compiledSections: [],
      compiledAssets: [],
      warnings: [],
      errors: [],
      logs: [],
      loading: false
    });
  }
}));
