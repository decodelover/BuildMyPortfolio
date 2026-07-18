import { ContentTask, ContentTaskStatus, ContentBlockType } from "../types";

export class TaskQueue {
  private queue: ContentTask[] = [];
  private completedTypes = new Set<ContentBlockType>();

  public load(tasks: ContentTask[]): void {
    this.queue = [...tasks];
    this.completedTypes.clear();
  }

  public getNextReadyTask(): ContentTask | null {
    // Sort logic: critical first, then high, medium, low.
    // Inside the sorted list, pick the first one that is "pending" and whose dependencies are ALL completed.
    const priorityWeights = { critical: 4, high: 3, medium: 2, low: 1 };

    const sortedTasks = [...this.queue].sort((a, b) => {
      return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
    });

    for (const task of sortedTasks) {
      if (task.status === "pending" || task.status === "queued") {
        const allDepsMet = task.dependencies.every((dep) => this.completedTypes.has(dep));
        if (allDepsMet) {
          return task;
        }
      }
    }
    return null;
  }

  public updateStatus(taskId: string, status: ContentTaskStatus, error: string | null = null): void {
    const task = this.queue.find((t) => t.id === taskId);
    if (task) {
      task.status = status;
      if (error !== null) {
        task.error = error;
      }
      if (status === "completed") {
        this.completedTypes.add(task.type);
      }
    }
  }

  public getTask(taskId: string): ContentTask | undefined {
    return this.queue.find((t) => t.id === taskId);
  }

  public getAllTasks(): ContentTask[] {
    return [...this.queue];
  }

  public getPending(): ContentTask[] {
    return this.queue.filter((t) => t.status === "pending" || t.status === "queued");
  }

  public getCompleted(): ContentTask[] {
    return this.queue.filter((t) => t.status === "completed");
  }

  public getFailed(): ContentTask[] {
    return this.queue.filter((t) => t.status === "failed");
  }

  public isFinished(): boolean {
    return this.queue.every((t) => t.status === "completed" || t.status === "failed" || t.status === "skipped");
  }

  public incrementRetry(taskId: string): number {
    const task = this.queue.find((t) => t.id === taskId);
    if (task) {
      task.retryCount++;
      return task.retryCount;
    }
    return 0;
  }

  public reset(): void {
    this.queue = [];
    this.completedTypes.clear();
  }
}
