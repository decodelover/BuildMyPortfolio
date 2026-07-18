import { create } from "zustand";
import {
  ContentBlock,
  ContentTask,
  PipelineStatus,
  PortfolioValidationResult,
  ContentResult
} from "@/lib/ai/content-agent/types";
import { ContentPipeline } from "@/lib/ai/content-agent/pipeline/content-pipeline";

export interface ContentAgentStoreState {
  pipelineStatus: PipelineStatus;
  progress: number;
  currentTask: ContentTask | null;
  completedTasks: ContentTask[];
  pendingTasks: ContentTask[];
  failedTasks: ContentTask[];
  validationState: PortfolioValidationResult | null;
  contentBlocks: ContentBlock[];
  error: string | null;
  logs: string[];
  
  // Actions
  executePipeline: (portfolioData: any) => Promise<ContentResult | null>;
  resetAgent: () => void;
}

export const useContentAgentStore = create<ContentAgentStoreState>((set, get) => ({
  pipelineStatus: "idle",
  progress: 0,
  currentTask: null,
  completedTasks: [],
  pendingTasks: [],
  failedTasks: [],
  validationState: null,
  contentBlocks: [],
  error: null,
  logs: [],

  executePipeline: async (portfolioData: any) => {
    set({
      pipelineStatus: "idle",
      progress: 0,
      currentTask: null,
      completedTasks: [],
      pendingTasks: [],
      failedTasks: [],
      validationState: null,
      contentBlocks: [],
      error: null,
      logs: ["Initializing Content Agent..."]
    });

    const pipeline = new ContentPipeline();

    try {
      const result = await pipeline.run(portfolioData, {
        onStatusChange: (status) => {
          set({ pipelineStatus: status });
          set((state) => ({ logs: [...state.logs, `Pipeline status changed: ${status}`] }));
        },
        onProgress: (progress) => {
          set({ progress });
        },
        onTaskStart: (task) => {
          set({ currentTask: task });
          set((state) => ({
            logs: [...state.logs, `Starting task ${task.type}...`],
            pendingTasks: state.pendingTasks.filter((t) => t.id !== task.id)
          }));
        },
        onTaskComplete: (task, block) => {
          set((state) => ({
            completedTasks: [...state.completedTasks, task],
            contentBlocks: [...state.contentBlocks, block],
            currentTask: null,
            logs: [...state.logs, `Task ${task.type} completed successfully.`]
          }));
        },
        onTaskFail: (task, err) => {
          set((state) => ({
            failedTasks: [...state.failedTasks, task],
            currentTask: null,
            logs: [...state.logs, `Task ${task.type} failed: ${err.message}`]
          }));
        }
      });

      return result;
    } catch (err: any) {
      set({
        pipelineStatus: "failed",
        error: err.message || "Content generation pipeline failed."
      });
      set((state) => ({ logs: [...state.logs, `Pipeline execution error: ${err.message}`] }));
      return null;
    }
  },

  resetAgent: () => {
    set({
      pipelineStatus: "idle",
      progress: 0,
      currentTask: null,
      completedTasks: [],
      pendingTasks: [],
      failedTasks: [],
      validationState: null,
      contentBlocks: [],
      error: null,
      logs: []
    });
  }
}));
