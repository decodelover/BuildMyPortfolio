import { AgentId, AgentOutput } from "./types";

export class GenerationContext {
  private outputs = new Map<AgentId, AgentOutput>();
  
  constructor(
    public readonly userId: string,
    public readonly builderId: string,
    public readonly planId: string,
    public readonly websiteData: Record<string, any>,
    public readonly plan: any
  ) {}

  public setAgentOutput(agentId: AgentId, output: AgentOutput): void {
    this.outputs.set(agentId, output);
  }

  public getAgentOutput<T = Record<string, any>>(agentId: AgentId): T | undefined {
    const output = this.outputs.get(agentId);
    return output?.success ? (output.data as T) : undefined;
  }

  public hasAgentOutput(agentId: AgentId): boolean {
    return this.outputs.has(agentId) && !!this.outputs.get(agentId)?.success;
  }

  public getAllOutputs(): Map<AgentId, AgentOutput> {
    return new Map(this.outputs);
  }
}
