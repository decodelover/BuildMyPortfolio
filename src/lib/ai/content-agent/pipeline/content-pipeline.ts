import { PortfolioInputData, ContentResult, ContentBlock, ContentTask, PipelineStatus } from "../types";
import { InputProcessor } from "../services/input-processor";
import { TaskGenerator } from "../services/task-generator";
import { TaskQueue } from "../services/task-queue";
import { ContentExecutor } from "../services/content-executor";
import { IAIContentProvider } from "../provider-interface";
import { MockContentProvider } from "../providers/mock-provider";
import { ContentAgentLogger } from "../logging/content-agent-logger";
import { PipelineError } from "../errors/content-agent-errors";

export interface PipelineCallbacks {
  onStatusChange?: (status: PipelineStatus) => void;
  onProgress?: (progress: number) => void;
  onTaskStart?: (task: ContentTask) => void;
  onTaskComplete?: (task: ContentTask, block: ContentBlock) => void;
  onTaskFail?: (task: ContentTask, error: Error) => void;
}

export class ContentPipeline {
  private queue = new TaskQueue();
  private logger = new ContentAgentLogger();
  private provider: IAIContentProvider;

  constructor(provider?: IAIContentProvider) {
    this.provider = provider || new MockContentProvider();
  }

  public async run(
    rawInput: PortfolioInputData,
    callbacks?: PipelineCallbacks
  ): Promise<ContentResult> {
    const totalStartTime = Date.now();
    this.logger.pipelineStarted();
    callbacks?.onStatusChange?.("validating");
    callbacks?.onProgress?.(5);

    try {
      // 1. Sanitize, Validate and Normalize Input
      this.logger.info("Starting input processing and verification.");
      const { data, validation } = InputProcessor.process(rawInput);
      
      if (!validation.isValid) {
        const errorMsg = `Input verification failed. Found critical blocking errors.`;
        this.logger.validationError(validation.issues);
        throw new PipelineError(errorMsg);
      }

      callbacks?.onStatusChange?.("normalizing");
      callbacks?.onProgress?.(15);
      this.logger.info("Data normalized successfully.");

      // 2. Task List Generation
      callbacks?.onStatusChange?.("generating_tasks");
      const tasks = TaskGenerator.generate(data);
      this.queue.load(tasks);
      this.logger.info(`Generated ${tasks.length} content tasks.`);
      callbacks?.onProgress?.(25);

      // 3. Queue up execution loops
      callbacks?.onStatusChange?.("executing");
      const executor = new ContentExecutor(this.provider);
      const blocks: ContentBlock[] = [];

      let finished = false;
      let totalTasksCount = tasks.length;

      while (!finished) {
        const task = this.queue.getNextReadyTask();
        if (task) {
          // Update status to running
          this.queue.updateStatus(task.id, "running");
          this.logger.taskStarted(task.id, task.type);
          callbacks?.onTaskStart?.(task);

          try {
            const block = await executor.execute(task, data);
            
            this.queue.updateStatus(task.id, "completed");
            this.logger.taskCompleted(task.id, task.type);
            blocks.push(block);
            callbacks?.onTaskComplete?.(task, block);
          } catch (err: any) {
            this.queue.updateStatus(task.id, "failed", err.message);
            this.logger.taskFailed(task.id, task.type, err);
            callbacks?.onTaskFail?.(task, err);
          }

          // Calculate current percentage progress based on queue status
          const completedCount = this.queue.getCompleted().length;
          const failedCount = this.queue.getFailed().length;
          const currentProgress = 25 + Math.round(((completedCount + failedCount) / totalTasksCount) * 75);
          callbacks?.onProgress?.(currentProgress);
        } else {
          // If no tasks are ready and the queue is not completely finished,
          // then either we have unresolvable dependency blocks or all remaining tasks failed.
          const pending = this.queue.getPending();
          if (pending.length > 0) {
            // Unmet dependencies or block loop detected
            pending.forEach((t) => {
              this.queue.updateStatus(t.id, "skipped", "Dependency failure or loop block.");
            });
          }
          finished = true;
        }
      }

      callbacks?.onProgress?.(100);
      callbacks?.onStatusChange?.("completed");

      const totalEndTime = Date.now();
      const executionTimeMs = totalEndTime - totalStartTime;

      const failedTasks = this.queue.getFailed().length;
      
      const result: ContentResult = {
        blocks,
        metadata: {
          pipelineVersion: "1.0.0",
          completedAt: new Date().toISOString(),
          totalTasks: totalTasksCount,
          failedTasks,
          executionTimeMs,
          overallQualityScore: failedTasks > 0 ? Math.round((1 - failedTasks / totalTasksCount) * 100) : 100
        }
      };

      this.logger.pipelineCompleted(result.metadata);
      return result;

    } catch (err: any) {
      callbacks?.onStatusChange?.("failed");
      this.logger.pipelineFailed(err);
      throw err;
    }
  }
}
