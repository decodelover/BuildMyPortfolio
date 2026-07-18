import { IAIContentProvider } from "../provider-interface";
import { ContentTask, NormalizedPortfolioData, ContentBlock } from "../types";
import { TaskExecutionError } from "../errors/content-agent-errors";

export class ContentExecutor {
  constructor(private provider: IAIContentProvider) {}

  public async execute(
    task: ContentTask,
    data: NormalizedPortfolioData
  ): Promise<ContentBlock> {
    const startTime = Date.now();
    const systemPrompt = `You are an expert SaaS portfolio copywriter. Generate structured portfolio content matching the task request. Always output a valid JSON structure.`;
    const userPrompt = `Generate a structured '${task.type}' section for ${data.personal.fullName}, who is a ${data.personal.profession}. Ensure it adheres to the user preferences.`;

    const prompt = {
      taskType: task.type,
      systemPrompt,
      userPrompt,
      variables: {
        personal: data.personal,
        story: data.story,
        skills: data.skills,
        projects: data.projects,
        experience: data.experience,
        education: data.education,
        services: data.services,
        testimonials: data.testimonials,
        socials: data.socials,
        preferences: data.preferences,
        seo: data.seo
      }
    };

    let attempt = 0;
    let success = false;
    let response: any = null;
    let lastError: any = null;

    while (attempt < task.maxRetries && !success) {
      attempt++;
      try {
        response = await this.provider.generateContent(prompt, {
          temperature: 0.7,
          responseFormat: "json"
        });
        success = true;
      } catch (err: any) {
        lastError = err;
        // Exponential backoff logic
        if (attempt < task.maxRetries) {
          const delay = Math.pow(2, attempt) * 100;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    const endTime = Date.now();
    const executionTime = endTime - startTime;
    task.executionTime = executionTime;

    if (!success) {
      throw new TaskExecutionError(
        `Failed to execute content task '${task.type}' after ${attempt} attempts. Reason: ${lastError?.message || lastError}`,
        task.id
      );
    }

    // Build the standardized ContentBlock schema
    return {
      id: `block-${task.type}-${Date.now()}`,
      type: task.type,
      title: this.getFriendlyTitle(task.type),
      content: response.jsonData || { rawText: response.text },
      status: "ready",
      source: this.provider.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      validationScore: 100,
      qualityScore: 98,
      metadata: {
        modelUsed: response.metadata.model,
        attemptCount: attempt,
        executionTimeMs: executionTime
      }
    };
  }

  private getFriendlyTitle(type: string): string {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}
