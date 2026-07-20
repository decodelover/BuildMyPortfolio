import { AIProviderId } from "../types";
import { IAIProvider } from "./provider-interface";
import { AIProviderRegistry } from "./provider-registry";
import { AIProviderConfig } from "../config/ai-provider-config";
import { AIProviderUnavailableError } from "../errors/ai-provider-errors";

export class AIProviderFactory {
  public static getProvider(providerId?: AIProviderId): IAIProvider {
    const targetId = providerId || (AIProviderConfig.defaultProvider as AIProviderId);
    const registry = AIProviderRegistry.getInstance();
    const provider = registry.get(targetId);

    if (!provider) {
      throw new AIProviderUnavailableError(`AI Provider '${targetId}' is not registered in AIProviderRegistry.`, targetId);
    }

    if (!provider.isConfigured()) {
      throw new AIProviderUnavailableError(`AI Provider '${targetId}' API credentials are missing or unconfigured.`, targetId);
    }

    return provider;
  }
}
