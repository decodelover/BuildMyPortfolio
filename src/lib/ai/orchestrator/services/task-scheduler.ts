import { TaskDefinition } from "../types";

export class TaskScheduler {
  public static getReadyTasks(
    tasks: TaskDefinition[],
    completedTaskIds: Set<string>,
    runningTaskIds: Set<string>
  ): TaskDefinition[] {
    return tasks.filter((t) => {
      if (completedTaskIds.has(t.id) || runningTaskIds.has(t.id)) {
        return false;
      }
      return t.dependencies.every((depId) => completedTaskIds.has(depId));
    });
  }
}
