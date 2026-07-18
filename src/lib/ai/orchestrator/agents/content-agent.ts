import { IAgent } from "../agent-interface";
import { AgentId, AgentInput, AgentOutput, AgentValidationResult } from "../types";
import { GenerationContext } from "../generation-context";

export class ContentAgent implements IAgent {
  public readonly id: AgentId = "content";
  public readonly name: string = "Content Writer Agent";
  public readonly description: string = "Generates targeted page section copy, headings, and taglines matching the brand tone.";
  public readonly dependencies: AgentId[] = [];

  public validate(input: AgentInput): AgentValidationResult {
    const errors: string[] = [];
    
    // Check if personalInfo is present
    if (!input.websiteData?.personalInfo?.fullName) {
      errors.push("Missing core user profile name in wizard data.");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public async execute(input: AgentInput, context: GenerationContext): Promise<AgentOutput> {
    const personal = input.websiteData.personalInfo || {};
    const story = input.websiteData.professionalStory || {};
    const services = input.websiteData.services || {};
    const projects = input.websiteData.projects || {};
    
    // Stub generation content output
    const contentMap: Record<string, any> = {
      hero: {
        headline: personal.headline || `I build high-performance web applications`,
        subheadline: personal.bioSummary || `Senior Full-stack Engineer specializing in React, Next.js and Cloud Systems.`,
        ctaText: "View My Works",
        secondaryCtaText: "Let's Connect"
      },
      about: {
        title: "My Professional Journey",
        storyParagraphs: [
          story.backgroundSummary || `I am an expert developer with a passion for clean architecture and robust APIs.`,
          story.careerMilestones || `Over the past years, I have helped startups build scalable SaaS platforms and optimize codebases.`
        ]
      },
      services: {
        title: "Premium Services",
        items: (services.services || []).map((s: any, idx: number) => ({
          id: s.id || `srv-${idx}`,
          title: s.title || "Custom Development",
          description: s.description || "Building responsive web platforms with modern stacks.",
          price: s.price || "Contact for Quote"
        }))
      },
      projects: {
        title: "Selected Case Studies",
        items: (projects.projects || []).map((p: any, idx: number) => ({
          id: p.id || `proj-${idx}`,
          title: p.title || "Production SaaS Dashboard",
          description: p.description || "A robust client dashboard integrated with Firebase.",
          tags: p.technologies || ["TypeScript", "Next.js"]
        }))
      }
    };

    return {
      agentId: this.id,
      success: true,
      data: {
        generatedContent: contentMap,
        toneScore: 0.95,
        wordCount: 420
      }
    };
  }
}
