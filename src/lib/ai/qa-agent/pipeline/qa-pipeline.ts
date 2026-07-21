import { QualityReport, QAPipelineStatus, QAIssue } from "../types";
import { QaInputProcessor } from "../services/qa-input-processor";
import { ContentQualityEngine } from "../engines/content-quality-engine";
import { DesignQualityEngine } from "../engines/design-quality-engine";
import { SeoQualityEngine } from "../engines/seo-quality-engine";
import { TechnicalValidationEngine } from "../engines/technical-validation-engine";
import { PerformanceEngine } from "../engines/performance-engine";
import { AccessibilityEngine } from "../engines/accessibility-engine";
import { SecurityValidationEngine } from "../engines/security-validation-engine";
import { QualityScoringEngine } from "../engines/quality-scoring-engine";
import { QualityReportEngine } from "../engines/quality-report-engine";
import { QaValidators } from "../validators/qa-validators";
import { QaAgentLogger } from "../logging/qa-agent-logger";
import { QaPipelineError } from "../errors/qa-agent-errors";

export interface QaPipelineCallbacks {
  onStatusChange?: (status: QAPipelineStatus) => void;
  onProgress?: (progress: number) => void;
}

export class QaPipeline {
  private logger = new QaAgentLogger();

  public async run(
    userId: string,
    builderId: string,
    planId: string,
    rawInput: Record<string, any>,
    contentBlocks: any[] = [],
    designBlueprint?: any,
    seoBlueprint?: any,
    callbacks?: QaPipelineCallbacks
  ): Promise<QualityReport> {
    const totalStartTime = Date.now();
    this.logger.pipelineStarted();
    callbacks?.onStatusChange?.("processing_input");
    callbacks?.onProgress?.(10);

    try {
      // 1. Normalize and process inputs
      const context = QaInputProcessor.process({
        userId,
        builderId,
        planId,
        rawInput,
        contentBlocks,
        designBlueprint,
        seoBlueprint
      });
      this.logger.info(`QA Input data normalized and processed successfully. User: ${userId}`);

      const issues: QAIssue[] = [];
      const warnings: string[] = [];
      const passedChecks: string[] = [];

      // 2. Validate Content Quality
      callbacks?.onStatusChange?.("validating_content");
      callbacks?.onProgress?.(20);
      const contentStartTime = Date.now();
      this.logger.engineStarted("ContentQualityEngine");
      const contentResult = ContentQualityEngine.analyze(context);
      this.logger.engineCompleted("ContentQualityEngine", Date.now() - contentStartTime);
      issues.push(...contentResult.issues);
      warnings.push(...contentResult.warnings);
      if (contentResult.passed) passedChecks.push("Content Quality Checks");

      // 3. Validate Design Quality
      callbacks?.onStatusChange?.("validating_design");
      callbacks?.onProgress?.(35);
      const designStartTime = Date.now();
      this.logger.engineStarted("DesignQualityEngine");
      const designResult = DesignQualityEngine.analyze(context);
      this.logger.engineCompleted("DesignQualityEngine", Date.now() - designStartTime);
      issues.push(...designResult.issues);
      warnings.push(...designResult.warnings);
      if (designResult.passed) passedChecks.push("Design Quality Checks");

      // 4. Validate SEO Quality
      callbacks?.onStatusChange?.("validating_seo");
      callbacks?.onProgress?.(50);
      const seoStartTime = Date.now();
      this.logger.engineStarted("SeoQualityEngine");
      const seoResult = SeoQualityEngine.analyze(context);
      this.logger.engineCompleted("SeoQualityEngine", Date.now() - seoStartTime);
      issues.push(...seoResult.issues);
      warnings.push(...seoResult.warnings);
      if (seoResult.passed) passedChecks.push("SEO Quality Checks");

      // 5. Validate Technical Integrity
      callbacks?.onStatusChange?.("validating_technical");
      callbacks?.onProgress?.(65);
      const techStartTime = Date.now();
      this.logger.engineStarted("TechnicalValidationEngine");
      const techResult = TechnicalValidationEngine.analyze(context);
      this.logger.engineCompleted("TechnicalValidationEngine", Date.now() - techStartTime);
      issues.push(...techResult.issues);
      warnings.push(...techResult.warnings);
      if (techResult.passed) passedChecks.push("Technical Integrity Checks");

      // 6. Validate Performance Metrics
      callbacks?.onStatusChange?.("validating_performance");
      callbacks?.onProgress?.(75);
      const perfStartTime = Date.now();
      this.logger.engineStarted("PerformanceEngine");
      const perfResult = PerformanceEngine.analyze(context);
      this.logger.engineCompleted("PerformanceEngine", Date.now() - perfStartTime);
      issues.push(...perfResult.issues);
      warnings.push(...perfResult.warnings);
      if (perfResult.passed) passedChecks.push("Performance Optimization Checks");

      // 7. Validate Accessibility Rules
      callbacks?.onStatusChange?.("validating_accessibility");
      callbacks?.onProgress?.(85);
      const accessStartTime = Date.now();
      this.logger.engineStarted("AccessibilityEngine");
      const accessResult = AccessibilityEngine.analyze(context);
      this.logger.engineCompleted("AccessibilityEngine", Date.now() - accessStartTime);
      issues.push(...accessResult.issues);
      warnings.push(...accessResult.warnings);
      if (accessResult.passed) passedChecks.push("Accessibility Standards Checks");

      // 8. Validate Security Constraints
      callbacks?.onStatusChange?.("validating_security");
      callbacks?.onProgress?.(90);
      const securityStartTime = Date.now();
      this.logger.engineStarted("SecurityValidationEngine");
      const securityResult = SecurityValidationEngine.analyze(context);
      this.logger.engineCompleted("SecurityValidationEngine", Date.now() - securityStartTime);
      issues.push(...securityResult.issues);
      warnings.push(...securityResult.warnings);
      if (securityResult.passed) passedChecks.push("Security Scanning Checks");

      // 9. Scoring Calculation
      callbacks?.onStatusChange?.("scoring");
      callbacks?.onProgress?.(95);
      const scores = QualityScoringEngine.calculate(context, {
        content: contentResult.score,
        design: designResult.score,
        seo: seoResult.score,
        technical: techResult.score,
        performance: perfResult.score,
        accessibility: accessResult.score,
        security: securityResult.score
      });

      // 10. Compile Quality Report
      callbacks?.onStatusChange?.("compiling_report");
      callbacks?.onProgress?.(98);
      const report = QualityReportEngine.compile({
        userId,
        builderId,
        planId,
        scores,
        issues,
        warnings,
        passedChecks,
        executionTimeMs: Date.now() - totalStartTime
      });

      // 11. Final Report Schema Validation check
      const validation = QaValidators.validateReport(report);
      if (!validation.isValid) {
        throw new QaPipelineError(`QA generated report structure validation failed: ${validation.errors.join(", ")}`);
      }

      callbacks?.onStatusChange?.("completed");
      callbacks?.onProgress?.(100);

      const totalDuration = Date.now() - totalStartTime;
      this.logger.pipelineCompleted({ reportId: report.reportId, totalDurationMs: totalDuration });

      return report;
    } catch (err: any) {
      callbacks?.onStatusChange?.("failed");
      this.logger.pipelineFailed(err);
      throw err;
    }
  }
}
