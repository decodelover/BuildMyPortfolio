import { WorkflowDefinition, ExecutionPlan, ExecutionStage } from "../types";
import { DependencyManager } from "./dependency-manager";

export class ExecutionPlanner {
  public static buildExecutionPlan(workflow: WorkflowDefinition, executionId: string): ExecutionPlan {
    const validatedTasks = DependencyManager.validateAndSortTasks(workflow.tasks);
    const stages: ExecutionStage[] = [];

    const completedTaskIds = new Set<string>();
    const remainingTasks = [...validatedTasks];

    let stageIndex = 0;

    while (remainingTasks.length > 0) {
      // Find all tasks whose dependencies have ALL been completed in previous stages
      const readyTasks = remainingTasks.filter((t) =>
        t.dependencies.every((depId) => completedTaskIds.has(depId))
      );

      if (readyTasks.length === 0) {
        // Fallback for safety to prevent infinite loop
        const forced = remainingTasks.shift()!;
        stages.push({
          stageIndex,
          stageName: `Stage ${stageIndex + 1}: ${forced.name}`,
          tasks: [forced],
          isParallel: false
        });
        completedTaskIds.add(forced.id);
        stageIndex++;
        continue;
      }

      // Check if tasks can run in parallel
      const parallelTasks = readyTasks.filter((t) => t.allowParallel);
      const isParallel = parallelTasks.length > 1;

      const stageTasks = isParallel ? parallelTasks : [readyTasks[0]];

      stages.push({
        stageIndex,
        stageName: `Stage ${stageIndex + 1}: ${stageTasks.map((t) => t.name).join(" & ")}`,
        tasks: stageTasks,
        isParallel
      });

      // Mark stage tasks as completed for dependency calculations
      stageTasks.forEach((t) => {
        completedTaskIds.add(t.id);
        const idx = remainingTasks.findIndex((rt) => rt.id === t.id);
        if (idx !== -1) {
          remainingTasks.splice(idx, 1);
        }
      });

      stageIndex++;
    }

    return {
      workflowId: workflow.workflowId,
      executionId,
      stages,
      totalTasksCount: workflow.tasks.length
    };
  }
}
