import { AgentId, AgentOutput, CheckpointData } from "../types";

export class ExecutionContext {
  private outputs = new Map<AgentId, AgentOutput>();
  private metadata = new Map<string, any>();
  private checkpoints: CheckpointData[] = [];
  private history: string[] = [];

  constructor(
    public readonly executionId: string,
    public readonly userId: string,
    public readonly builderId: string,
    public readonly planId: string,
    public readonly websiteData: Record<string, any>,
    public readonly plan: any
  ) {}

  public setAgentOutput(agentId: AgentId, output: AgentOutput): void {
    this.outputs.set(agentId, output);
    this.recordHistory(`Agent '${agentId}' completed execution.`);
  }

  public getAgentOutput<T = Record<string, any>>(agentId: AgentId): T | undefined {
    const output = this.outputs.get(agentId);
    return output?.success ? (output.data as T) : undefined;
  }

  public hasAgentOutput(agentId: AgentId): boolean {
    return this.outputs.has(agentId) && !!this.outputs.get(agentId)?.success;
  }

  public setMetadata(key: string, value: any): void {
    this.metadata.set(key, value);
  }

  public getMetadata<T = any>(key: string): T | undefined {
    return this.metadata.get(key);
  }

  public recordHistory(eventMessage: string): void {
    this.history.push(`[${new Date().toISOString()}] ${eventMessage}`);
  }

  public getHistory(): string[] {
    return [...this.history];
  }

  public saveCheckpoint(checkpointId: string, completedTaskIds: string[]): CheckpointData {
    const outputsObj: Record<string, any> = {};
    this.outputs.forEach((val, key) => {
      outputsObj[key] = val;
    });

    const checkpoint: CheckpointData = {
      checkpointId,
      timestamp: new Date().toISOString(),
      completedTaskIds: [...completedTaskIds],
      outputs: outputsObj
    };

    this.checkpoints.push(checkpoint);
    this.recordHistory(`Checkpoint '${checkpointId}' saved (${completedTaskIds.length} tasks).`);
    return checkpoint;
  }

  public getLatestCheckpoint(): CheckpointData | undefined {
    return this.checkpoints[this.checkpoints.length - 1];
  }

  public getAllOutputs(): Map<AgentId, AgentOutput> {
    return new Map(this.outputs);
  }
}
