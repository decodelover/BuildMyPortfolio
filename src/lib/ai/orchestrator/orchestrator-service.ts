import { AgentRegistry } from "./agent-registry";
import { ContentAgent } from "./agents/content-agent";
import { DesignAgent } from "./agents/design-agent";
import { SEOAgent } from "./agents/seo-agent";
import { QAAgent } from "./agents/qa-agent";
import { CompilerAgent } from "./agents/compiler-agent";
import { JobLifecycleManager } from "./job-lifecycle";
import { ManifestBuilder } from "./manifest-builder";
import { StructuredLogger } from "./logger";
import { OrchestrationEngine } from "./engine/orchestration-engine";
import { AgentId } from "./types";

export interface OrchestrationParams {
  jobId: string;
  userId: string;
  builderId: string;
  planId: string;
  websiteData: Record<string, any>;
  plan: any; // WebsiteGenerationPlan
}

export class OrchestratorService {
  private static initialized = false;

  public static initialize(): void {
    if (this.initialized) return;

    const registry = AgentRegistry.getInstance();
    registry.clear();
    registry.register(new ContentAgent());
    registry.register(new DesignAgent());
    registry.register(new SEOAgent());
    registry.register(new QAAgent());
    registry.register(new CompilerAgent());

    this.initialized = true;
    console.log("[Orchestrator] Multi-agent registry initialized successfully.");
  }

  public static async executeWorkflow(params: OrchestrationParams): Promise<void> {
    this.initialize();
    
    const { jobId, userId, builderId, planId, websiteData, plan } = params;
    const logger = new StructuredLogger(jobId);
    
    logger.info("Starting AI Orchestration Workflow.", undefined, { userId, builderId, planId });

    try {
      // 1. Create or retrieve the job state in Firestore
      await JobLifecycleManager.createJob(jobId, userId, builderId, planId);
      await JobLifecycleManager.updateJobStatus(jobId, "running", 5);

      // 2. Delegate execution to Master OrchestrationEngine with real-time Firestore state listener
      const workflowResult = await OrchestrationEngine.executeWorkflow({
        workflowId: "portfolio-generation",
        userId,
        builderId,
        planId,
        websiteData,
        plan,
        onEvent: async (evt) => {
          if (evt.progress) {
            await JobLifecycleManager.updateJobStatus(jobId, "running", evt.progress);
          }
          if (evt.agentId) {
            if (evt.type === "task:started") {
              await JobLifecycleManager.updateAgentState(jobId, evt.agentId as AgentId, {
                status: "running",
                startedAt: evt.timestamp,
                attempts: 1
              });
            } else if (evt.type === "task:completed") {
              await JobLifecycleManager.updateAgentState(jobId, evt.agentId as AgentId, {
                status: "completed",
                completedAt: evt.timestamp
              });
            } else if (evt.type === "task:failed") {
              await JobLifecycleManager.updateAgentState(jobId, evt.agentId as AgentId, {
                status: "failed",
                completedAt: evt.timestamp,
                error: evt.error || "Agent task execution failed."
              });
            }
          }
        }
      });

      if (!workflowResult.success) {
        const failureReason = workflowResult.errors.join("; ") || "Orchestration workflow failed.";
        await JobLifecycleManager.updateJobStatus(jobId, "failed", 100, failureReason);
        throw new Error(failureReason);
      }

      // 3. Build and Persist Final Manifest
      logger.info("Compiling final website manifest from orchestration result.");
      const compilerOutput = workflowResult.manifest
        ? { manifest: workflowResult.manifest }
        : { manifest: workflowResult.blueprint };

      const manifestId = `man-${jobId}`;
      await ManifestBuilder.buildAndPersist(manifestId, userId, builderId, planId, compilerOutput);
      
      logger.info("Manifest built and persisted successfully.", undefined, { manifestId });

      // 4. Complete Generation Job
      await JobLifecycleManager.updateJobStatus(jobId, "completed", 100, null, manifestId);
      logger.info("Portfolio generation job completed successfully.");

    } catch (err: any) {
      const errorMessage = err?.message || String(err) || "An unexpected error occurred during orchestration.";
      logger.error(`Generation workflow failed: ${errorMessage}`);
      await JobLifecycleManager.updateJobStatus(jobId, "failed", 100, errorMessage);
    }
  }
}
