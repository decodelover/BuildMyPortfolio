import { IAgent } from "../agent-interface";
import { AgentId, AgentInput, AgentOutput, AgentValidationResult } from "../types";
import { GenerationContext } from "../generation-context";

export class DesignAgent implements IAgent {
  public readonly id: AgentId = "design";
  public readonly name: string = "Visual Design Agent";
  public readonly description: string = "Resolves responsive grid sizes, spacing constants, layout schemas, and interactive component suggestions.";
  public readonly dependencies: AgentId[] = ["content"];

  public validate(input: AgentInput): AgentValidationResult {
    const errors: string[] = [];
    if (!input.websiteData?.websitePreferences) {
      errors.push("Missing websitePreferences in wizard input.");
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public async execute(input: AgentInput, context: GenerationContext): Promise<AgentOutput> {
    // Access content agent's output from context to model visual styling layout
    const contentResult = context.getAgentOutput<{ generatedContent: Record<string, any> }>("content");
    const prefs = input.websiteData.websitePreferences || {};
    
    // Resolve design tokens
    const stylesMap: Record<string, any> = {
      global: {
        containerWidth: "max-w-7xl",
        paddingX: "px-4 sm:px-6 lg:px-8",
        gapSize: "gap-8",
        borderRadius: prefs.borderRadius || "8px",
        animationClass: "transition-all duration-300 ease-in-out"
      },
      sections: {
        hero: {
          layoutType: "split-right-image",
          bgGradient: "from-primary/10 via-background to-background",
          ctaButtonVariant: "default",
          secondaryCtaVariant: "outline"
        },
        about: {
          layoutType: "grid-two-cols",
          cardTheme: "glassmorphism",
          imagePosition: "left"
        },
        services: {
          layoutType: "responsive-grid-three-cols",
          hoverEffect: "hover:-translate-y-2 hover:shadow-xl"
        },
        projects: {
          layoutType: "featured-grid-large-first",
          showTags: true,
          aspectRatio: "aspect-video"
        }
      }
    };

    return {
      agentId: this.id,
      success: true,
      data: {
        resolvedStyles: stylesMap,
        layoutScore: 0.98,
        themeId: prefs.theme || "modern-dark"
      }
    };
  }
}
