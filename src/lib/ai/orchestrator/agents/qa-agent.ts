import { IAgent } from "../agent-interface";
import { AgentId, AgentInput, AgentOutput, AgentValidationResult } from "../types";
import { GenerationContext } from "../generation-context";
import { QaPipeline } from "../../qa-agent/pipeline/qa-pipeline";

export class QAAgent implements IAgent {
  public readonly id: AgentId = "qa";
  public readonly name: string = "Quality Assurance Agent";
  public readonly description: string = "Conducts structural validation, checks visual consistency, verifies page hierarchy, and grades accessibility compliance.";
  public readonly dependencies: AgentId[] = ["content", "design", "seo"];

  public validate(input: AgentInput): AgentValidationResult {
    const errors: string[] = [];
    if (!input.websiteData) {
      errors.push("Missing websiteData inputs in generation pipeline.");
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public async execute(input: AgentInput, context: GenerationContext): Promise<AgentOutput> {
    const contentOut = context.getAgentOutput<any>("content");
    const designOut = context.getAgentOutput<any>("design");
    const seoOut = context.getAgentOutput<any>("seo");

    const pipeline = new QaPipeline();

    try {
      const report = await pipeline.run(
        input.userId,
        input.builderId,
        input.planId,
        input.websiteData,
        [], // contentBlocks
        designOut,
        seoOut
      );

      const auditChecks = report.issues.map((iss) => ({
        id: iss.id,
        rule: iss.rule,
        status: iss.severity === "critical" || iss.severity === "high" ? "failed" : "passed",
        category: iss.category,
        message: iss.message,
        recommendation: iss.recommendation
      }));

      // Add a default positive check if no critical issues found to ensure validation has feedback
      if (auditChecks.length === 0) {
        auditChecks.push({
          id: "qa-pass-all",
          rule: "all-quality-standards",
          status: "passed",
          category: "content",
          message: "All validation constraints met successfully.",
          recommendation: "Ready for portfolio compilation."
        });
      }

      return {
        agentId: this.id,
        success: true,
        data: {
          auditChecks,
          overallQualityScore: report.scores.overall,
          warnings: report.warnings,
          passed: report.passFailStatus === "pass",
          reportId: report.reportId
        }
      };
    } catch (err: any) {
      return {
        agentId: this.id,
        success: false,
        data: {},
        error: err.message || "Quality Assurance Agent pipeline run failed."
      };
    }
  }
}
