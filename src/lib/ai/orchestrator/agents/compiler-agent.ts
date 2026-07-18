import { IAgent } from "../agent-interface";
import { AgentId, AgentInput, AgentOutput, AgentValidationResult, WebsiteManifest } from "../types";
import { GenerationContext } from "../generation-context";

export class CompilerAgent implements IAgent {
  public readonly id: AgentId = "compiler";
  public readonly name: string = "Portfolio Compiler Agent";
  public readonly description: string = "Assembles the final website design, page layouts, copy, visuals, and SEO mappings into a compiled WebsiteManifest.";
  public readonly dependencies: AgentId[] = ["content", "design", "seo", "qa"];

  public validate(input: AgentInput): AgentValidationResult {
    return {
      isValid: true,
      errors: []
    };
  }

  public async execute(input: AgentInput, context: GenerationContext): Promise<AgentOutput> {
    const content = context.getAgentOutput<any>("content")?.generatedContent || {};
    const design = context.getAgentOutput<any>("design")?.resolvedStyles || {};
    const seo = context.getAgentOutput<any>("seo")?.seoMetadata || {};
    const qa = context.getAgentOutput<any>("qa") || {};
    
    const prefs = input.websiteData.websitePreferences || {};
    const colors = input.plan?.palette || {
      primary: "#3b82f6",
      secondary: "#1d4ed8",
      accent: "#f59e0b",
      background: "#ffffff",
      cardBg: "#f3f4f6",
      border: "#e5e7eb",
      textPrimary: "#1f2937",
      textSecondary: "#4b5563"
    };
    const typography = input.plan?.typography || {
      headingsFont: "Inter",
      bodyFont: "Inter",
      monoFont: "Fira Code"
    };

    // Construct final layout pages
    const pages: WebsiteManifest["pages"] = [
      {
        name: "Home",
        slug: "home",
        seo: {
          title: seo.titleTemplate?.replace("%s", "Home") || "Home Portfolio",
          description: seo.defaultDescription || "",
          keywords: seo.keywords || []
        },
        sections: [
          {
            id: "sec-hero",
            type: "hero",
            title: content.hero?.headline || "My Portfolio",
            content: content.hero || {},
            styles: design.sections?.hero || {}
          },
          {
            id: "sec-about",
            type: "about",
            title: content.about?.title || "About Me",
            content: content.about || {},
            styles: design.sections?.about || {}
          },
          {
            id: "sec-services",
            type: "services",
            title: content.services?.title || "My Services",
            content: content.services || {},
            styles: design.sections?.services || {}
          },
          {
            id: "sec-projects",
            type: "projects",
            title: content.projects?.title || "Projects Showcase",
            content: content.projects || {},
            styles: design.sections?.projects || {}
          }
        ]
      }
    ];

    const manifest: Omit<WebsiteManifest, "manifestId"> = {
      userId: input.userId,
      builderId: input.builderId,
      planId: input.planId,
      pages,
      theme: {
        themeId: design.themeId || prefs.theme || "default-light",
        palette: colors,
        typography
      },
      metadata: {
        compiledAt: new Date().toISOString(),
        compilerVersion: "1.0.0",
        qualityScore: qa.overallQualityScore || 100
      }
    };

    return {
      agentId: this.id,
      success: true,
      data: {
        manifest
      }
    };
  }
}
