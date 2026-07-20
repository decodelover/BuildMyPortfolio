import { IAgent } from "../agent-interface";
import { AgentId, AgentInput, AgentOutput, AgentValidationResult, WebsiteManifest } from "../types";
import { GenerationContext } from "../generation-context";
import { CompilationPipeline } from "../../compilation-engine/pipeline/compilation-pipeline";
import { PortfolioBlueprint } from "../../compilation-engine/types";

export class CompilerAgent implements IAgent {
  public readonly id: AgentId = "compiler";
  public readonly name: string = "Portfolio Compiler Agent";
  public readonly description: string = "Compiles outputs from all previous agents into a single framework-independent Enterprise Portfolio Blueprint and WebsiteManifest.";
  public readonly dependencies: AgentId[] = ["content", "design", "seo", "qa"];

  public validate(input: AgentInput): AgentValidationResult {
    return {
      isValid: true,
      errors: []
    };
  }

  public async execute(input: AgentInput, context: GenerationContext): Promise<AgentOutput> {
    const content = context.getAgentOutput<any>("content") || {};
    const design = context.getAgentOutput<any>("design") || {};
    const seo = context.getAgentOutput<any>("seo") || {};
    const qa = context.getAgentOutput<any>("qa") || {};

    const contentBlocks = content.contentBlocks || content.blocks || [];
    const designBlueprint = design.blueprint || design.designBlueprint || design;
    const seoBlueprint = seo.blueprint || seo.seoBlueprint || seo;
    const qualityReport = qa.report || qa.qualityReport || qa;

    // 1. Execute the Enterprise Portfolio Compilation Pipeline
    const compilationResult = await CompilationPipeline.execute({
      userId: input.userId,
      builderId: input.builderId,
      planId: input.planId,
      rawInput: input.websiteData,
      contentBlocks,
      designBlueprint,
      seoBlueprint,
      qualityReport
    });

    if (!compilationResult.success || !compilationResult.blueprint) {
      return {
        agentId: this.id,
        success: false,
        data: {},
        error: `Portfolio compilation engine failed: ${compilationResult.errors.join("; ")}`
      };
    }

    const blueprint = compilationResult.blueprint;

    // 2. Convert PortfolioBlueprint to WebsiteManifest for backward compatibility with orchestrator & storage
    const manifest = this.convertBlueprintToManifest(blueprint);

    return {
      agentId: this.id,
      success: true,
      data: {
        blueprint,
        manifest,
        version: compilationResult.version,
        metrics: compilationResult.metrics
      }
    };
  }

  private convertBlueprintToManifest(blueprint: PortfolioBlueprint): Omit<WebsiteManifest, "manifestId"> {
    return {
      userId: blueprint.userId,
      builderId: blueprint.builderId,
      planId: blueprint.planId,
      pages: blueprint.navigation.routes.map((route) => ({
        name: route.pageName,
        slug: route.metadata?.slug || route.pageName.toLowerCase(),
        seo: {
          title: blueprint.seo.metaTitle,
          description: blueprint.seo.metaDescription,
          keywords: blueprint.seo.keywords
        },
        sections: blueprint.sections.map((sec) => ({
          id: sec.id,
          type: sec.type,
          title: sec.title,
          content: sec.content,
          styles: sec.styles
        }))
      })),
      theme: {
        themeId: blueprint.theme.themeId,
        palette: blueprint.theme.colors,
        typography: {
          headingsFont: blueprint.theme.typography.headingsFont,
          bodyFont: blueprint.theme.typography.bodyFont,
          monoFont: blueprint.theme.typography.monoFont
        }
      },
      metadata: {
        compiledAt: blueprint.metadata.compiledAt,
        compilerVersion: blueprint.metadata.compilerVersion,
        qualityScore: blueprint.metadata.qualityScore
      }
    };
  }
}
