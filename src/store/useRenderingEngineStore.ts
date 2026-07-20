import { create } from "zustand";
import { RenderReport, RenderContext, RenderPerformanceMetrics } from "@/lib/rendering-engine/types";
import { PortfolioRenderingEngine } from "@/lib/rendering-engine/engine/portfolio-rendering-engine";

export interface RenderingEngineStoreState {
  renderStatus: "idle" | "rendering" | "completed" | "failed";
  context: RenderContext | null;
  metrics: RenderPerformanceMetrics | null;
  errors: string[];
  warnings: string[];

  // Actions
  renderBlueprint: (blueprintInput: any) => RenderReport;
  resetStore: () => void;
}

export const useRenderingEngineStore = create<RenderingEngineStoreState>((set) => ({
  renderStatus: "idle",
  context: null,
  metrics: null,
  errors: [],
  warnings: [],

  renderBlueprint: (blueprintInput: any) => {
    set({ renderStatus: "rendering" });
    const report = PortfolioRenderingEngine.prepareRenderContext(blueprintInput);

    if (report.success && report.context) {
      set({
        renderStatus: "completed",
        context: report.context,
        metrics: report.metrics,
        warnings: report.warnings,
        errors: []
      });
    } else {
      set({
        renderStatus: "failed",
        context: null,
        metrics: report.metrics,
        errors: report.errors,
        warnings: report.warnings
      });
    }

    return report;
  },

  resetStore: () => {
    set({
      renderStatus: "idle",
      context: null,
      metrics: null,
      errors: [],
      warnings: []
    });
  }
}));
