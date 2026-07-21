import { create } from "zustand";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "@/lib/firebase/client";
import { JobStatus, AgentId, AgentState, GenerationLogEntry, GenerationJob } from "@/lib/ai/orchestrator/types";

export interface GenerationState {
  jobId: string | null;
  jobStatus: JobStatus | null;
  progress: number;
  agentStates: Record<AgentId, AgentState> | null;
  logs: GenerationLogEntry[];
  error: string | null;
  manifestId: string | null;
  loading: boolean;

  // Actions
  startGeneration: (planId: string, builderId: string) => Promise<void>;
  resetGeneration: () => void;
}

let unsubscribeSnapshot: (() => void) | null = null;

export const useGenerationStore = create<GenerationState>((set, _get) => ({
  jobId: null,
  jobStatus: null,
  progress: 0,
  agentStates: null,
  logs: [],
  error: null,
  manifestId: null,
  loading: false,

  startGeneration: async (planId: string, builderId: string) => {
    // 1. Unsubscribe from any active listeners first
    if (unsubscribeSnapshot) {
      unsubscribeSnapshot();
      unsubscribeSnapshot = null;
    }

    set({
      loading: true,
      error: null,
      jobId: null,
      jobStatus: "queued",
      progress: 0,
      agentStates: null,
      logs: [],
      manifestId: null
    });

    try {
      // 2. Retrieve auth token
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("User must be authenticated to initiate generation.");
      }
      const token = await currentUser.getIdToken();

      // 3. Request generation job from api
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ planId, builderId })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to start orchestration workflow.");
      }

      const { jobId } = await response.json();

      set({ jobId, loading: false });

      // 4. Listen to the generation job document in real time
      const jobRef = doc(db, "generationJobs", jobId);
      unsubscribeSnapshot = onSnapshot(
        jobRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data() as GenerationJob;
            set({
              jobStatus: data.status,
              progress: data.progress || 0,
              agentStates: data.agentStates || null,
              logs: data.logs || [],
              error: data.error || null,
              manifestId: data.manifestId || null
            });

            // Auto-unsubscribe on terminal state
            if (data.status === "completed" || data.status === "failed" || data.status === "cancelled") {
              if (unsubscribeSnapshot) {
                unsubscribeSnapshot();
                unsubscribeSnapshot = null;
              }
            }
          }
        },
        (err) => {
          console.error("Realtime snapshot listener error:", err);
          set({ error: "Lost connection to the generation job server." });
        }
      );

    } catch (err: any) {
      console.error("Failed to start website generation:", err);
      set({
        error: err.message || "Failed to launch generation process.",
        jobStatus: "failed",
        loading: false
      });
    }
  },

  resetGeneration: () => {
    if (unsubscribeSnapshot) {
      unsubscribeSnapshot();
      unsubscribeSnapshot = null;
    }
    set({
      jobId: null,
      jobStatus: null,
      progress: 0,
      agentStates: null,
      logs: [],
      error: null,
      manifestId: null,
      loading: false
    });
  }
}));
