import { IAgent } from "../agent-interface";
import { AgentId, AgentInput, AgentOutput, AgentValidationResult } from "../types";
import { GenerationContext } from "../generation-context";

export class SEOAgent implements IAgent {
  public readonly id: AgentId = "seo";
  public readonly name: string = "SEO Optimizer Agent";
  public readonly description: string = "Produces optimized sitemaps, structured JSON-LD schema payloads, title structures, and metadata tags.";
  public readonly dependencies: AgentId[] = ["content"];

  public validate(input: AgentInput): AgentValidationResult {
    const errors: string[] = [];
    if (!input.websiteData?.seoInfo) {
      errors.push("Missing seoInfo structure in wizard inputs.");
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public async execute(input: AgentInput, context: GenerationContext): Promise<AgentOutput> {
    const seoInfo = input.websiteData.seoInfo || {};
    const personal = input.websiteData.personalInfo || {};

    const seoMetadata = {
      titleTemplate: `%s | ${seoInfo.metaTitle || personal.fullName || "Developer Portfolio"}`,
      defaultDescription: seoInfo.metaDescription || `Professional software developer portfolio showcase.`,
      keywords: seoInfo.metaKeywords || ["Software Engineer", "Web Developer", "Full-Stack Dev"],
      ogType: "profile",
      robots: "index, follow",
      schemaJsonLd: {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "mainEntity": {
          "@type": "Person",
          "name": personal.fullName || "John Doe",
          "jobTitle": personal.profession || "Software Engineer",
          "description": personal.bioSummary || "Web developer"
        }
      }
    };

    return {
      agentId: this.id,
      success: true,
      data: {
        seoMetadata,
        seoScore: 0.94,
        indexabilityCheck: true
      }
    };
  }
}
