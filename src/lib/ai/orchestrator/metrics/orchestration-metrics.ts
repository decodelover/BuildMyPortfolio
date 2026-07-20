import { WorkflowExecutionMetrics, TaskExecutionMetric, TaskStatus, AgentId } from "../types";

export class OrchestrationMetricsCollector {
  private static instance: OrchestrationMetricsCollector | null = null;
  private taskMetrics: TaskExecutionMetric[] = [];
  private parallelStagesCount = 0;
  private serialStagesCount = 0;
  private totalTokensProcessed = 0;
  private totalEstimatedCostUsd = 0;

  private constructor() {}

  public static getInstance(): OrchestrationMetricsCollector {
    if (!OrchestrationMetricsCollector.instance) {
      OrchestrationMetricsCollector.instance = new OrchestrationMetricsCollector();
    }
    return OrchestrationMetricsCollector.instance;
  }

  public recordTask(taskId: string, agentId: AgentId, durationMs: number, attempts: number, status: TaskStatus): void {
    this.taskMetrics.push({
      taskId,
      agentId,
      durationMs,
      attempts,
      status
    });
  }

  public recordStage(isParallel: boolean): void {
    if (isParallel) {
      this.parallelStagesCount++;
    } else {
      this.serialStagesCount++;
    }
  }

  public addTokensAndCost(tokens: number, costUsd: number): void {
    this.totalTokensProcessed += tokens;
    this.totalEstimatedCostUsd += costUsd;
  }

  public getMetrics(totalDurationMs: number): WorkflowExecutionMetrics {
    return {
      totalDurationMs,
      taskMetrics: [...this.taskMetrics],
      parallelStagesCount: this.parallelStagesCount,
      serialStagesCount: this.serialStagesCount,
      totalTokensProcessed: this.totalTokensProcessed,
      totalEstimatedCostUsd: Math.round(this.totalEstimatedCostUsd * 10000) / 10000,
      peakMemoryMb: Math.round((process.memoryUsage?.().heapUsed || 0) / (1024 * 1024) * 100) / 100
    };
  }

  public reset(): void {
    this.taskMetrics = [];
    this.parallelStagesCount = 0;
    this.serialStagesCount = 0;
    this.totalTokensProcessed = 0;
    this.totalEstimatedCostUsd = 0;
  }
}
