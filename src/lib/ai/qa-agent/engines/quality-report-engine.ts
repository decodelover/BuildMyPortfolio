import { QAContext, QualityReport, QAIssue, QAScores } from "../types";
import { QaAgentConfig } from "../config/qa-agent-config";

export class QualityReportEngine {
  public static compile(params: {
    userId: string;
    builderId: string;
    planId: string;
    scores: QAScores;
    issues: QAIssue[];
    warnings: string[];
    passedChecks: string[];
    executionTimeMs: number;
  }): QualityReport {
    const {
      userId,
      builderId,
      planId,
      scores,
      issues,
      warnings,
      passedChecks,
      executionTimeMs
    } = params;

    const reportId = `rep-qa-${Date.now()}`;

    // 1. Determine overall pass/fail status
    let passFailStatus: "pass" | "fail" = "pass";

    if (scores.overall < QaAgentConfig.thresholds.overallMinScore) {
      passFailStatus = "fail";
    }

    const minDimScore = QaAgentConfig.thresholds.dimensionMinScore;
    if (
      scores.contentQuality < minDimScore ||
      scores.designQuality < minDimScore ||
      scores.seoQuality < minDimScore ||
      scores.technicalIntegrity < minDimScore ||
      scores.security < minDimScore ||
      scores.accessibility < minDimScore
    ) {
      passFailStatus = "fail";
    }

    // 2. Sort and filter issues
    // Critical errors are issues with severity "critical" or "high"
    const criticalErrors = issues
      .filter(iss => iss.severity === "critical" || iss.severity === "high")
      .map(iss => `${iss.message} (${iss.recommendation})`);

    const recommendations = issues
      .filter(iss => iss.severity !== "info")
      .map(iss => iss.recommendation);

    // 3. Generate summary text
    let summary = "";
    if (passFailStatus === "pass") {
      if (scores.overall >= 90) {
        summary = "Excellent portfolio! Content, design, SEO, and security metrics are outstanding and fully ready for compiler build.";
      } else {
        summary = "Portfolio quality checks passed. Some minor performance or SEO optimizations are suggested before deployment.";
      }
    } else {
      summary = `Quality checks failed. Found ${criticalErrors.length} critical issues that require resolution prior to compilation.`;
    }

    return {
      reportId,
      userId,
      builderId,
      planId,
      summary,
      scores,
      issues,
      passedChecks,
      criticalErrors,
      warnings,
      recommendations: Array.from(new Set(recommendations)),
      passFailStatus,
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      executionTimeMs
    };
  }
}
