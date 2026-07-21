import {
  ExecutionPlan,
  WorkflowResult
} from "../types";
import { ExecutionContext } from "../context/execution-context";
import { ParallelExecutionManager } from "./parallel-execution-manager";
import { ErrorRecoveryManager } from "./error-recovery-manager";
import { OrchestrationLogger } from "../logging/orchestration-logger";
import { OrchestrationMetricsCollector } from "../metrics/orchestration-metrics";
import { WorkflowEventBus } from "../events/workflow-event-bus";
import { OrchestrationConfig } from "../config/orchestration-config";

export class WorkflowExecutor {
  public static async executePlan(
    plan: ExecutionPlan,
    context: ExecutionContext,
    logger: OrchestrationLogger,
    eventBus: WorkflowEventBus
  ): Promise<WorkflowResult> {
    const startTime = Date.now();
    const metricsCollector = OrchestrationMetricsCollector.getInstance();
    metricsCollector.reset();

    const completedTaskIds = new Set<string>();
    const skippedTaskIds = new Set<string>();
    const warnings: string[] = [];
    const errors: string[] = [];

    logger.workflowStarted(plan.workflowId, plan.executionId);
    eventBus.emit({
      type: "workflow:started",
      workflowId: plan.workflowId,
      executionId: plan.executionId,
      timestamp: new Date().toISOString(),
      message: `Workflow '${plan.workflowId}' started.`
    });

    try {
      let tasksExecuted = 0;

      for (let i = 0; i < plan.stages.length; i++) {
        const stage = plan.stages[i];
        logger.stageStarted(stage.stageIndex, stage.stageName, stage.isParallel);
        metricsCollector.recordStage(stage.isParallel);

        eventBus.emit({
          type: "stage:started",
          workflowId: plan.workflowId,
          executionId: plan.executionId,
          timestamp: new Date().toISOString(),
          message: `Stage ${stage.stageIndex + 1} started: ${stage.stageName}`
        });

        const stageStartTime = Date.now();

        // Execute stage tasks in parallel or serial via ParallelExecutionManager
        const _stageResults = await ParallelExecutionManager.executeStage(stage, context, logger, eventBus);

        stage.tasks.forEach((t) => {
          completedTaskIds.add(t.id);
          tasksExecuted++;
          metricsCollector.recordTask(t.id, t.agentId, Date.now() - stageStartTime, 1, "completed");
        });

        const stageDuration = Date.now() - stageStartTime;
        logger.stageCompleted(stage.stageIndex, stage.stageName, stageDuration);

        eventBus.emit({
          type: "stage:completed",
          workflowId: plan.workflowId,
          executionId: plan.executionId,
          timestamp: new Date().toISOString(),
          message: `Stage ${stage.stageIndex + 1} completed in ${stageDuration}ms`
        });

        // Save Checkpoint after stage completion
        ErrorRecoveryManager.saveCheckpoint(context, Array.from(completedTaskIds), logger, eventBus);

        // Update progress percentage
        const progress = Math.round((tasksExecuted / plan.totalTasksCount) * 100);
        eventBus.emit({
          type: "progress:updated",
          workflowId: plan.workflowId,
          executionId: plan.executionId,
          timestamp: new Date().toISOString(),
          progress,
          message: `Workflow progress: ${progress}%`
        });
      }

      const totalDurationMs = Date.now() - startTime;
      logger.workflowCompleted(plan.workflowId, plan.executionId, totalDurationMs);

      const metrics = metricsCollector.getMetrics(totalDurationMs);

      // Retrieve compiler output if available
      const compilerOutput = context.getAgentOutput<any>("compiler");
      const blueprint = compilerOutput?.blueprint || null;
      const manifest = compilerOutput?.manifest || null;

      const result: WorkflowResult = {
        workflowId: plan.workflowId,
        executionId: plan.executionId,
        success: true,
        completedTasks: Array.from(completedTaskIds),
        skippedTasks: Array.from(skippedTaskIds),
        warnings,
        errors: [],
        executionTimeMs: totalDurationMs,
        metrics,
        blueprint,
        manifest,
        metadata: {
          planId: context.planId,
          builderId: context.builderId,
          userId: context.userId
        },
        version: OrchestrationConfig.engineVersion,
        timestamp: new Date().toISOString()
      };

      eventBus.emit({
        type: "workflow:completed",
        workflowId: plan.workflowId,
        executionId: plan.executionId,
        timestamp: new Date().toISOString(),
        progress: 100,
        message: `Workflow '${plan.workflowId}' completed successfully in ${totalDurationMs}ms`
      });

      return result;

    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      const errorMsg = err.message || String(err);
      errors.push(errorMsg);
      logger.workflowFailed(plan.workflowId, plan.executionId, err);

      eventBus.emit({
        type: "workflow:failed",
        workflowId: plan.workflowId,
        executionId: plan.executionId,
        timestamp: new Date().toISOString(),
        error: errorMsg,
        message: `Workflow '${plan.workflowId}' failed: ${errorMsg}`
      });

      return {
        workflowId: plan.workflowId,
        executionId: plan.executionId,
        success: false,
        completedTasks: Array.from(completedTaskIds),
        skippedTasks: Array.from(skippedTaskIds),
        warnings,
        errors,
        executionTimeMs: durationMs,
        metrics: metricsCollector.getMetrics(durationMs),
        metadata: {
          planId: context.planId,
          builderId: context.builderId,
          userId: context.userId
        },
        version: OrchestrationConfig.engineVersion,
        timestamp: new Date().toISOString()
      };
    }
  }
}
