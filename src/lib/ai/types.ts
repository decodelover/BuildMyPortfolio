export interface BlueprintPage {
  name: string;
  slug: string;
  priority: "essential" | "recommended" | "optional";
  description: string;
}

export interface SectionOrdering {
  section: string;
  reason: string;
}

export interface ContentAnalysis {
  tone: string;
  strengths: string[];
  improvements: string[];
}

export interface DesignRecommendations {
  colorSuggestion: string;
  typographySuggestion: string;
  layoutSuggestion: string;
}

export interface SEORecommendations {
  titleSuggestion: string;
  descriptionSuggestion: string;
  keywords: string[];
}

export interface AIBlueprint {
  overallScore: number;
  summary: string;
  recommendedPages: BlueprintPage[];
  sectionOrder: SectionOrdering[];
  contentAnalysis: ContentAnalysis;
  designRecommendations: DesignRecommendations;
  seoRecommendations: SEORecommendations;
  missingDataWarnings: string[];
}
