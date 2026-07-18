import { ContentBlockType } from "./types";

export interface ContentGenerationPrompt {
  taskType: ContentBlockType;
  systemPrompt: string;
  userPrompt: string;
  variables: Record<string, any>;
  constraints?: string[];
}

export interface ContentGenerationConfig {
  temperature?: number;
  maxTokens?: number;
  responseFormat?: "text" | "json";
}

export interface AIProviderMetadata {
  name: string;
  model: string;
  version: string;
}

export interface ContentGenerationResponse {
  text: string;
  jsonData?: Record<string, any>;
  metadata: AIProviderMetadata;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface IAIContentProvider {
  id: string;
  name: string;
  generateContent(
    prompt: ContentGenerationPrompt,
    config?: ContentGenerationConfig
  ): Promise<ContentGenerationResponse>;
}
