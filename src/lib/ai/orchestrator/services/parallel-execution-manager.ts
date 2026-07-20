import { ExecutionStage, TaskDefinition, AgentInput, AgentOutput } from "../types";
import { ExecutionContext } from "../context/execution-context";
import { AgentRegistry } from "../agent-registry";
import { TaskExecutionError } from "../errors/orchestration-errors";
import { OrchestrationLogger } from "../logging/orchestration-logger";
import { WorkflowEventBus } from "../events/workflow-event-bus";

export class ParallelExecutionManager {
  public static async executeStage(
    stage: ExecutionStage,
    context: ExecutionContext,
    logger?: OrchestrationLogger,
    eventBus?: WorkflowEventBus
  ): Promise<Record<string, AgentOutput>> {
    const registry = AgentRegistry.getInstance();
    const stageResults: Record<string, AgentOutput> = {};

    const agentInput: AgentInput = {
      userId: context.userId,
      builderId: context.builderId,
      planId: context.planId,
      websiteData: context.websiteData,
      plan: context.plan
    };

    const taskPromises = stage.tasks.map(async (task: TaskDefinition) => {
      const agent = registry.get(task.agentId);
      if (!agent) {
        throw new TaskExecutionError(task.id, `Agent '${task.agentId}' is not registered in AgentRegistry.`);
      }

      if (logger) logger.taskStarted(task.id, task.agentId);
      if (eventBus) {
        eventBus.emit({
          type: "task:started",
          workflowId: "portfolio-generation",
          executionId: context.executionId,
          timestamp: new Date().toISOString(),
          taskId: task.id,
          agentId: task.agentId,
          message: `Starting task '${task.name}'`
        });
      }

      const startTime = Date.now();
      const output = await agent.execute(agentInput, context as any);

      if (!output || !output.success) {
        const errorMsg = output?.error || `Agent '${task.agentId}' returned unsuccessful result.`;
        if (logger) logger.taskFailed(task.id, new Error(errorMsg));
        if (eventBus) {
          eventBus.emit({
            type: "task:failed",
            workflowId: "portfolio-generation",
            executionId: context.executionId,
            timestamp: new Date().toISOString(),
            taskId: task.id,
            agentId: task.agentId,
            error: errorMsg
          });
        }
        throw new TaskExecutionError(task.id, errorMsg);
      }

      const durationMs = Date.now() - startTime;
      if (logger) logger.taskCompleted(task.id, durationMs);
      context.setAgentOutput(task.agentId, output);

      if (eventBus) {
        eventBus.emit({
          type: "task:completed",
          workflowId: "portfolio-generation",
          executionId: context.executionId,
          timestamp: new Date().toISOString(),
          taskId: task.id,
          agentId: task.agentId,
          message: `Completed task '${task.name}' in ${durationMs}ms`
        });
      }

      return { taskId: task.id, output };
    });

    const results = await Promise.allSettled(taskPromises);

    const failures: string[] = [];
    results.forEach((res, idx) => {
      const task = stage.tasks[idx];
      if (res.status === "fulfilled") {
        stageResults[task.id] = res.value.output;
      } else {
        failures.push(`Task '${task.id}' failed: ${res.reason?.message || res.reason}`);
      }
    });

    if (failures.length > 0) {
      throw new TaskExecutionError(stage.stageName, `Parallel stage execution failed: ${failures.join("; ")}`);
    }

    return stageResults;
  }
}
