import { create } from "zustand";
import { WorkflowType, WorkflowResult, WorkflowExecutionMetrics, WorkflowEvent } from "@/lib/ai/orchestrator/types";
import { OrchestrationEngine } from "@/lib/ai/orchestrator/engine/orchestration-engine";

export interface OrchestratorStoreState {
  activeWorkflowId: WorkflowType | null;
  activeExecutionId: string | null;
  progress: number;
  status: "idle" | "running" | "completed" | "failed";
  stageName: string;
  currentTaskName: string;
  eventLogs: WorkflowEvent[];
  lastResult: WorkflowResult | null;
  metrics: WorkflowExecutionMetrics | null;
  error: string | null;
  loading: boolean;

  // Actions
  runWorkflow: (
    workflowId: WorkflowType,
    userId: string,
    builderId: string,
    planId: string,
    websiteData: Record<string, any>,
    plan: any
  ) => Promise<WorkflowResult | null>;
  resetOrchestrator: () => void;
}

export const useOrchestratorStore = create<OrchestratorStoreState>((set) => ({
  activeWorkflowId: null,
  activeExecutionId: null,
  progress: 0,
  status: "idle",
  stageName: "",
  currentTaskName: "",
  eventLogs: [],
  lastResult: null,
  metrics: null,
  error: null,
  loading: false,

  runWorkflow: async (workflowId, userId, builderId, planId, websiteData, plan) => {
    set({
      activeWorkflowId: workflowId,
      activeExecutionId: null,
      progress: 0,
      status: "running",
      stageName: "Initializing Workflow...",
      currentTaskName: "",
      eventLogs: [],
      lastResult: null,
      metrics: null,
      error: null,
      loading: true
    });

    try {
      const result = await OrchestrationEngine.executeWorkflow({
        workflowId,
        userId,
        builderId,
        planId,
        websiteData,
        plan,
        onEvent: (event) => {
          set((state) => {
            const updates: Partial<OrchestratorStoreState> = {
              eventLogs: [...state.eventLogs, event]
            };

            if (event.executionId) updates.activeExecutionId = event.executionId;
            if (typeof event.progress === "number") updates.progress = event.progress;

            if (event.type === "stage:started") {
              updates.stageName = event.message || "";
            } else if (event.type === "task:started") {
              updates.currentTaskName = event.message || "";
            } else if (event.type === "workflow:failed") {
              updates.status = "failed";
              updates.error = event.error || "Workflow execution failed.";
            }

            return updates;
          });
        }
      });

      if (result.success) {
        set({
          status: "completed",
          progress: 100,
          lastResult: result,
          metrics: result.metrics,
          loading: false
        });
        return result;
      } else {
        set({
          status: "failed",
          error: result.errors.join("; "),
          lastResult: result,
          metrics: result.metrics,
          loading: false
        });
        return null;
      }
    } catch (err: any) {
      const msg = err.message || "Orchestration workflow failed.";
      set({
        status: "failed",
        error: msg,
        loading: false
      });
      return null;
    }
  },

  resetOrchestrator: () => {
    set({
      activeWorkflowId: null,
      activeExecutionId: null,
      progress: 0,
      status: "idle",
      stageName: "",
      currentTaskName: "",
      eventLogs: [],
      lastResult: null,
      metrics: null,
      error: null,
      loading: false
    });
  }
}));
