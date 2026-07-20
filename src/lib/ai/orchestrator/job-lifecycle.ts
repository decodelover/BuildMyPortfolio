import { db } from "../../firebase/firestore";
import { doc, setDoc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { GenerationJob, JobStatus, AgentId, AgentStatus, GenerationLogEntry, AgentState } from "./types";

export class JobLifecycleManager {
  
  public static async createJob(
    jobId: string,
    userId: string,
    builderId: string,
    planId: string
  ): Promise<GenerationJob> {
    const initialAgentStates: Record<AgentId, AgentState> = {
      content: { agentId: "content", status: "idle", attempts: 0 },
      design: { agentId: "design", status: "idle", attempts: 0 },
      seo: { agentId: "seo", status: "idle", attempts: 0 },
      qa: { agentId: "qa", status: "idle", attempts: 0 },
      compiler: { agentId: "compiler", status: "idle", attempts: 0 }
    };

    const job: GenerationJob = {
      jobId,
      userId,
      builderId,
      planId,
      status: "queued",
      progress: 0,
      agentStates: initialAgentStates,
      logs: [
        {
          timestamp: new Date().toISOString(),
          level: "info",
          message: "Generation job initialized and queued."
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const jobRef = doc(db, "generationJobs", jobId);
    await setDoc(jobRef, job);

    return job;
  }

  public static async updateJobStatus(
    jobId: string,
    status: JobStatus,
    progress: number,
    error: string | null = null,
    manifestId: string | null = null
  ): Promise<void> {
    const jobRef = doc(db, "generationJobs", jobId);
    const updates: Record<string, any> = {
      status,
      progress,
      updatedAt: new Date().toISOString()
    };

    if (error !== null) {
      updates.error = error;
    }
    if (manifestId !== null) {
      updates.manifestId = manifestId;
    }

    await updateDoc(jobRef, updates);
  }

  public static async updateAgentState(
    jobId: string,
    agentId: AgentId,
    updates: Partial<AgentState>
  ): Promise<void> {
    const jobRef = doc(db, "generationJobs", jobId);
    
    // Construct nested field updates
    const nestedUpdates: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      nestedUpdates[`agentStates.${agentId}.${key}`] = value;
    }
    nestedUpdates.updatedAt = new Date().toISOString();

    await updateDoc(jobRef, nestedUpdates);
  }

  public static async addLogEntry(jobId: string, entry: GenerationLogEntry): Promise<void> {
    const jobRef = doc(db, "generationJobs", jobId);
    await updateDoc(jobRef, {
      logs: arrayUnion(entry),
      updatedAt: new Date().toISOString()
    });
  }

  public static async getJob(jobId: string): Promise<GenerationJob | null> {
    const jobRef = doc(db, "generationJobs", jobId);
    const snap = await getDoc(jobRef);
    if (snap.exists()) {
      return snap.data() as GenerationJob;
    }
    return null;
  }
}
