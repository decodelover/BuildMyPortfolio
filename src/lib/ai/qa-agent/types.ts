import { NormalizedPortfolioData, ContentBlock } from "../content-agent/types";
import { DesignBlueprint } from "../design-agent/types";
import { SEOBlueprint } from "../seo-agent/types";

export type QAIssueSeverity = "critical" | "high" | "medium" | "low" | "info";

export type QAIssueCategory =
  | "content"
  | "design"
  | "seo"
  | "technical"
  | "performance"
  | "accessibility"
  | "security";

export interface QAIssue {
  id: string;
  category: QAIssueCategory;
  severity: QAIssueSeverity;
  rule: string;
  message: string;
  recommendation: string;
  field?: string;
  metadata?: Record<string, any>;
}

export interface QAContext {
  userId: string;
  builderId: string;
  planId: string;
  rawInput: Record<string, any>;
  normalizedData: NormalizedPortfolioData;
  contentBlocks: ContentBlock[];
  designBlueprint?: DesignBlueprint;
  seoBlueprint?: SEOBlueprint;
}

export interface QACheckResult {
  passed: boolean;
  score: number;
  issues: QAIssue[];
  warnings: string[];
  metadata?: Record<string, any>;
}

export interface QAScores {
  contentQuality: number;
  designQuality: number;
  seoQuality: number;
  accessibility: number;
  performance: number;
  technicalIntegrity: number;
  security: number;
  professionalism: number;
  portfolioCompleteness: number;
  overall: number;
}

export interface QualityReport {
  reportId: string;
  userId: string;
  builderId: string;
  planId: string;
  summary: string;
  scores: QAScores;
  issues: QAIssue[];
  passedChecks: string[];
  criticalErrors: string[];
  warnings: string[];
  recommendations: string[];
  passFailStatus: "pass" | "fail";
  version: string;
  timestamp: string;
  executionTimeMs: number;
}

export type QAPipelineStatus =
  | "idle"
  | "processing_input"
  | "validating_content"
  | "validating_design"
  | "validating_seo"
  | "validating_technical"
  | "validating_performance"
  | "validating_accessibility"
  | "validating_security"
  | "scoring"
  | "compiling_report"
  | "completed"
  | "failed";
