import { QAScores, QAContext } from "../types";
import { QaAgentConfig } from "../config/qa-agent-config";

export class QualityScoringEngine {
  public static calculate(
    context: QAContext,
    scoresList: {
      content: number;
      design: number;
      seo: number;
      technical: number;
      performance: number;
      accessibility: number;
      security: number;
    }
  ): QAScores {
    const normalized = context.normalizedData;

    // 1. Calculate Portfolio Completeness Score (0 - 100)
    let completenessFactors = 0;
    let completenessCount = 0;

    const checkComplete = (val: any) => {
      completenessCount++;
      if (val && (typeof val !== "object" || Object.keys(val).length > 0)) {
        completenessFactors++;
      }
    };

    checkComplete(normalized.personal?.fullName);
    checkComplete(normalized.personal?.profession);
    checkComplete(normalized.personal?.headline);
    checkComplete(normalized.personal?.bioSummary);
    checkComplete(normalized.personal?.email);
    checkComplete(normalized.skills && normalized.skills.length > 0);
    checkComplete(normalized.projects && normalized.projects.length > 0);
    checkComplete(normalized.experience && normalized.experience.length > 0);
    checkComplete(normalized.socials && Object.keys(normalized.socials).length > 0);

    const portfolioCompleteness = Math.round((completenessFactors / completenessCount) * 100);

    // 2. Calculate Professionalism (0 - 100)
    // Professionalism is determined by having good spelling/tone, valid email, layout config, and complete profile info
    const professionalism = Math.round(
      (scoresList.content * 0.4) +
      (scoresList.technical * 0.3) +
      (scoresList.design * 0.3)
    );

    // 3. Weighted overall score
    const weights = QaAgentConfig.scoringWeights;
    const overall = Math.round(
      (scoresList.content * weights.contentQuality) +
      (scoresList.design * weights.designQuality) +
      (scoresList.seo * weights.seoQuality) +
      (scoresList.accessibility * weights.accessibility) +
      (scoresList.performance * weights.performance) +
      (scoresList.technical * weights.technicalIntegrity) +
      (scoresList.security * weights.security)
    );

    return {
      contentQuality: scoresList.content,
      designQuality: scoresList.design,
      seoQuality: scoresList.seo,
      accessibility: scoresList.accessibility,
      performance: scoresList.performance,
      technicalIntegrity: scoresList.technical,
      security: scoresList.security,
      professionalism,
      portfolioCompleteness,
      overall
    };
  }
}
