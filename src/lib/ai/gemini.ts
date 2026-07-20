import { AIBlueprint } from "./types";
import { AIProviderFactory } from "./ai-provider/providers/provider-factory";
import { AIPromptBuilder } from "./ai-provider/prompt-engine/prompt-builder";

/**
 * Generates an intelligent website blueprint based on the wizard's steps data (1-13).
 * Delegates request execution to the AI Provider Layer (Google Gemini Provider).
 * @param websiteData The structured object containing data from steps 1-13.
 * @returns The parsed AIBlueprint object.
 */
export async function generateBlueprint(websiteData: Record<string, any>): Promise<AIBlueprint> {
  const provider = AIProviderFactory.getProvider("gemini");

  const promptBuilder = new AIPromptBuilder()
    .setPromptType("blueprint")
    .setContextData(websiteData);

  const { promptText, systemInstruction } = promptBuilder.build();

  const response = await provider.generateContent<AIBlueprint>(promptText, {
    promptId: "wizard-blueprint-generation",
    config: {
      systemInstruction,
      responseMimeType: "application/json"
    }
  });

  if (!response.parsedResponse) {
    throw new Error(`Failed to compile AI website blueprint: AI provider returned invalid or unparseable JSON response.`);
  }

  return response.parsedResponse;
}
