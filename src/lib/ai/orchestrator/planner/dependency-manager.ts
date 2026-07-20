import { TaskDefinition } from "../types";
import { CircularDependencyError, OrchestrationError } from "../errors/orchestration-errors";

export class DependencyManager {
  public static validateAndSortTasks(tasks: TaskDefinition[]): TaskDefinition[] {
    const taskMap = new Map<string, TaskDefinition>();
    tasks.forEach((t) => taskMap.set(t.id, t));

    // 1. Verify all dependencies exist in the task list
    tasks.forEach((t) => {
      t.dependencies.forEach((depId) => {
        if (!taskMap.has(depId)) {
          throw new OrchestrationError(`Task '${t.id}' depends on non-existent task '${depId}'.`);
        }
      });
    });

    // 2. Topological Sort with Cycle Detection (Kahn's algorithm / DFS)
    const sorted: TaskDefinition[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (taskId: string) => {
      if (visiting.has(taskId)) {
        throw new CircularDependencyError(`Circular dependency detected in workflow tasks involving: '${taskId}'.`);
      }

      if (!visited.has(taskId)) {
        visiting.add(taskId);
        const task = taskMap.get(taskId);
        if (task) {
          task.dependencies.forEach((depId) => visit(depId));
        }
        visiting.delete(taskId);
        visited.add(taskId);
        if (task) {
          sorted.push(task);
        }
      }
    };

    tasks.forEach((t) => {
      if (!visited.has(t.id)) {
        visit(t.id);
      }
    });

    return sorted;
  }
}
