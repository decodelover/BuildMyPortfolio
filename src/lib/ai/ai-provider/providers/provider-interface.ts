import { AIRequestOptions, AIResponse, StreamProgressCallback, AIProviderId } from "../types";

export interface IAIProvider {
  readonly id: AIProviderId;
  readonly name: string;
  readonly defaultModel: string;
  readonly supportedModels: string[];

  isConfigured(): boolean;

  generateContent<T = any>(
    prompt: string,
    options?: AIRequestOptions
  ): Promise<AIResponse<T>>;

  generateStream(
    prompt: string,
    onProgress: StreamProgressCallback,
    options?: AIRequestOptions
  ): Promise<AIResponse<string>>;
}
