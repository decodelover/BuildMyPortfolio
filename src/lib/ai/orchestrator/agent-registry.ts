import { AgentId } from "./types";
import { IAgent } from "./agent-interface";

export class AgentRegistry {
  private static instance: AgentRegistry | null = null;
  private agents = new Map<AgentId, IAgent>();

  private constructor() {}

  public static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  public register(agent: IAgent): void {
    this.agents.set(agent.id, agent);
  }

  public get(id: AgentId): IAgent | undefined {
    return this.agents.get(id);
  }

  public getAll(): IAgent[] {
    return Array.from(this.agents.values());
  }

  public clear(): void {
    this.agents.clear();
  }

  /**
   * Performs topological sort on registered agents using standard DFS cycle detection
   */
  public getExecutionOrder(): AgentId[] {
    const order: AgentId[] = [];
    const visited = new Set<AgentId>();
    const temp = new Set<AgentId>();

    const visit = (id: AgentId) => {
      if (temp.has(id)) {
        throw new Error(`Circular dependency detected in agent workflow including: ${id}`);
      }
      if (!visited.has(id)) {
        temp.add(id);
        const agent = this.agents.get(id);
        if (agent) {
          for (const depId of agent.dependencies) {
            // Verify dependency is registered
            if (!this.agents.has(depId)) {
              throw new Error(`Missing agent dependency: agent '${id}' depends on unregistered agent '${depId}'`);
            }
            visit(depId);
          }
        }
        temp.delete(id);
        visited.add(id);
        order.push(id);
      }
    };

    for (const agentId of Array.from(this.agents.keys())) {
      if (!visited.has(agentId)) {
        visit(agentId);
      }
    }

    return order;
  }
}
