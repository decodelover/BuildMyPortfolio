import { AIProviderId } from "../types";
import { IAIProvider } from "./provider-interface";

export class AIProviderRegistry {
  private static instance: AIProviderRegistry | null = null;
  private providers = new Map<AIProviderId, IAIProvider>();

  private constructor() {}

  public static getInstance(): AIProviderRegistry {
    if (!AIProviderRegistry.instance) {
      AIProviderRegistry.instance = new AIProviderRegistry();
    }
    return AIProviderRegistry.instance;
  }

  public register(provider: IAIProvider): void {
    this.providers.set(provider.id, provider);
  }

  public get(id: AIProviderId): IAIProvider | undefined {
    return this.providers.get(id);
  }

  public getAll(): IAIProvider[] {
    return Array.from(this.providers.values());
  }

  public clear(): void {
    this.providers.clear();
  }
}
