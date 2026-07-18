import { AgentRegistry } from "./agent-registry";
import { ContentAgent } from "./agents/content-agent";
import { DesignAgent } from "./agents/design-agent";
import { SEOAgent } from "./agents/seo-agent";
import { QAAgent } from "./agents/qa-agent";
import { CompilerAgent } from "./agents/compiler-agent";
import { JobLifecycleManager } from "./job-lifecycle";
import { ManifestBuilder } from "./manifest-builder";
import { StructuredLogger } from "./logger";
import { GenerationContext } from "./generation-context";
import { AgentId, AgentStatus, AgentState, RetryPolicy, AgentInput } from "./types";

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
    registry.clear(); // Reset to prevent duplicates
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
    
    logger.info("Starting multi-agent portfolio generation process.", undefined, { userId, builderId, planId });

    try {
      // 1. Create or retrieve the job state
      await JobLifecycleManager.createJob(jobId, userId, builderId, planId);
      await JobLifecycleManager.updateJobStatus(jobId, "running", 5);

      // 2. Setup shared mutable context
      const context = new GenerationContext(userId, builderId, planId, websiteData, plan);

      // 3. Resolve execution order
      const registry = AgentRegistry.getInstance();
      const executionOrder = registry.getExecutionOrder();
      
      logger.info(`Resolved topological agent execution sequence: ${executionOrder.join(" -> ")}`);

      // 4. Run agents sequentially
      let completedAgents = 0;
      const totalAgents = executionOrder.length;

      for (const agentId of executionOrder) {
        const agent = registry.get(agentId);
        if (!agent) {
          throw new Error(`Failed to retrieve registered agent with ID: ${agentId}`);
        }

        logger.info(`Starting agent step: ${agent.name}`, agentId);
        
        const startTime = new Date().toISOString();
        await JobLifecycleManager.updateAgentState(jobId, agentId, {
          status: "running",
          startedAt: startTime,
          attempts: 1
        });

        // Set default retry policies
        const retryPolicy: RetryPolicy = {
          maxRetries: 3,
          backoffMs: 1000
        };

        const agentInput: AgentInput = {
          userId,
          builderId,
          planId,
          websiteData,
          plan
        };

        // 4.1 Validate agent inputs first
        const validation = agent.validate(agentInput);
        if (!validation.isValid) {
          const validationError = `Agent input validation failed: ${validation.errors.join(", ")}`;
          logger.error(validationError, agentId);
          await JobLifecycleManager.updateAgentState(jobId, agentId, {
            status: "failed",
            completedAt: new Date().toISOString(),
            error: validationError
          });
          throw new Error(validationError);
        }

        // 4.2 Execute agent with retries
        let attempt = 0;
        let success = false;
        let lastError: any = null;
        let agentOutput: any = null;

        while (attempt < retryPolicy.maxRetries && !success) {
          attempt++;
          if (attempt > 1) {
            logger.warn(`Retrying agent execution. Attempt ${attempt}/${retryPolicy.maxRetries}`, agentId);
            await JobLifecycleManager.updateAgentState(jobId, agentId, {
              attempts: attempt
            });
            // Backoff delay
            await new Promise((resolve) => setTimeout(resolve, retryPolicy.backoffMs * Math.pow(2, attempt - 2)));
          }

          try {
            agentOutput = await agent.execute(agentInput, context);
            if (agentOutput && agentOutput.success) {
              success = true;
            } else {
              lastError = agentOutput?.error || "Agent returned unsuccessful status code.";
            }
          } catch (err: any) {
            lastError = err.message || err || "Unknown error during agent execution.";
          }
        }

        const endTime = new Date().toISOString();

        if (success && agentOutput) {
          logger.info(`Agent step completed successfully.`, agentId);
          context.setAgentOutput(agentId, agentOutput);
          
          await JobLifecycleManager.updateAgentState(jobId, agentId, {
            status: "completed",
            completedAt: endTime
          });
        } else {
          logger.error(`Agent execution failed after ${attempt} attempts. Error: ${lastError}`, agentId);
          
          await JobLifecycleManager.updateAgentState(jobId, agentId, {
            status: "failed",
            completedAt: endTime,
            error: String(lastError)
          });
          throw new Error(`Execution of agent '${agentId}' failed: ${lastError}`);
        }

        completedAgents++;
        // Calculate progress dynamically (ranging from 10% to 90% during execution)
        const currentProgress = 10 + Math.round((completedAgents / totalAgents) * 80);
        await JobLifecycleManager.updateJobStatus(jobId, "running", currentProgress);
      }

      // 5. Build and Persist Final Manifest
      logger.info("Compiling final website manifest.");
      const compilerOutput = context.getAgentOutput("compiler");
      if (!compilerOutput) {
        throw new Error("Compiler agent output is missing in execution context.");
      }

      const manifestId = `man-${jobId}`;
      await ManifestBuilder.buildAndPersist(manifestId, userId, builderId, planId, compilerOutput);
      
      logger.info("Manifest built and persisted successfully.", undefined, { manifestId });

      // 6. Complete Generation Job
      await JobLifecycleManager.updateJobStatus(jobId, "completed", 100, null, manifestId);
      logger.info("Portfolio generation job completed successfully.");

    } catch (err: any) {
      const errorMessage = err?.message || String(err) || "An unexpected error occurred during orchestration.";
      logger.error(`Generation workflow failed: ${errorMessage}`);
      
      await JobLifecycleManager.updateJobStatus(jobId, "failed", 100, errorMessage);
    }
  }
}
