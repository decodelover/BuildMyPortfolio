import { AIPromptTemplates } from "./prompt-templates";

export type PromptType = "blueprint" | "content" | "design" | "seo" | "qa" | "custom";

export class AIPromptBuilder {
  private promptType: PromptType = "blueprint";
  private contextData: string = "";
  private customTemplate: string = "";
  private systemInstruction: string = AIPromptTemplates.systemRoleInstruction;

  public setPromptType(type: PromptType): this {
    this.promptType = type;
    return this;
  }

  public setContextData(data: string | Record<string, any>): this {
    if (typeof data === "object") {
      this.contextData = JSON.stringify(data, null, 2);
    } else {
      this.contextData = data;
    }
    return this;
  }

  public setCustomTemplate(template: string): this {
    this.customTemplate = template;
    this.promptType = "custom";
    return this;
  }

  public setSystemInstruction(instruction: string): this {
    this.systemInstruction = instruction;
    return this;
  }

  public build(): { promptText: string; systemInstruction: string } {
    let template = AIPromptTemplates.blueprintGeneration;

    switch (this.promptType) {
      case "content":
        template = AIPromptTemplates.contentAgentPrompt;
        break;
      case "design":
        template = AIPromptTemplates.designAgentPrompt;
        break;
      case "seo":
        template = AIPromptTemplates.seoAgentPrompt;
        break;
      case "qa":
        template = AIPromptTemplates.qaAgentPrompt;
        break;
      case "custom":
        template = this.customTemplate;
        break;
      default:
        template = AIPromptTemplates.blueprintGeneration;
    }

    const promptText = template.replace("{{CONTEXT_DATA}}", this.contextData);

    return {
      promptText,
      systemInstruction: this.systemInstruction
    };
  }
}
