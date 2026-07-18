import { AgentId, AgentInput, AgentOutput, AgentValidationResult } from "./types";
import { GenerationContext } from "./generation-context";

export interface IAgent {
  id: AgentId;
  name: string;
  description: string;
  dependencies: AgentId[];
  
  validate(input: AgentInput): AgentValidationResult;
  execute(input: AgentInput, context: GenerationContext): Promise<AgentOutput>;
}
