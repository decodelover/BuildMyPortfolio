import { NormalizedPortfolioData, ContentBlock } from "../content-agent/types";
import { DesignBlueprint } from "../design-agent/types";

export interface SEOContext {
  userId: string;
  builderId: string;
  planId: string;
  rawInput: Record<string, any>;
  normalizedData: NormalizedPortfolioData;
  contentBlocks: ContentBlock[];
  designBlueprint?: DesignBlueprint;
  seoPreference: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    canonicalUrl?: string;
    customSlug?: string;
  };
}

export interface PageMetadata {
  metaTitle: string;
  metaDescription: string;
  focusKeywords: string[];
  secondaryKeywords: string[];
  canonicalUrl: string;
  portfolioSlug: string;
  robots: {
    index: boolean;
    follow: boolean;
    googleBot?: string;
  };
  viewport: string;
  author: string;
  publisher?: string;
  language: string; // e.g. "en"
  geo?: {
    region?: string;
    position?: string;
    placename?: string;
  };
}

export interface StructuredDataSchemas {
  person: Record<string, any>;
  profilePage: Record<string, any>;
  webSite: Record<string, any>;
  organization: Record<string, any>;
  breadcrumbList: Record<string, any>;
  occupation?: Record<string, any>;
  service?: Record<string, any>[];
  project?: Record<string, any>[];
  article?: Record<string, any>[];
  faqPage?: Record<string, any>;
}

export interface SocialMetadata {
  openGraph: {
    title: string;
    description: string;
    url: string;
    type: "profile" | "website";
    siteName: string;
    image: string;
    imageWidth?: number;
    imageHeight?: number;
    imageAlt?: string;
    locale: string;
  };
  twitter: {
    card: "summary" | "summary_large_image";
    title: string;
    description: string;
    image: string;
    creator?: string;
    site?: string;
  };
  linkedin: {
    title: string;
    description: string;
    image: string;
  };
  discord: {
    title: string;
    description: string;
    image: string;
    colorHex?: string;
  };
  whatsapp: {
    title: string;
    description: string;
    image: string;
  };
  telegram: {
    title: string;
    description: string;
    image: string;
  };
}

export interface UrlRules {
  portfolioSlug: string;
  canonicalPath: string;
  sectionAnchors: Array<{
    sectionId: string;
    anchorId: string; // e.g. "#projects", "#about"
  }>;
  projectPaths: Array<{
    projectId: string;
    path: string; // e.g. "/projects/my-app"
  }>;
  blogPaths: Array<{
    postId: string;
    path: string;
  }>;
  redirects: Array<{
    from: string;
    to: string;
    statusCode: 301 | 302;
  }>;
  multilingual: {
    enabled: boolean;
    locales: string[];
    defaultLocale: string;
  };
}

export interface ContentSeoChecklist {
  headingHierarchy: {
    isValid: boolean;
    issues: string[];
  };
  keywordDensity: Record<string, number>; // keyword -> percentage
  sectionStructureScore: number; // 0 - 100
  internalLinkingScore: number;
  contentLengthScore: number;
  duplicateContentWarnings: string[];
  readabilityScore: number;
  semanticRelevanceIndex: number;
  imageAltCoverageScore: number;
  freshnessIndex: number;
  recommendations: string[];
}

export interface TechnicalSeoRules {
  sitemapStructure: {
    priority: number;
    changefreq: "daily" | "weekly" | "monthly";
    lastmod?: string;
  };
  robotsRules: {
    disallowPaths: string[];
    allowPaths: string[];
  };
  lazyLoadingStrategy: {
    images: "lazy" | "eager";
    scripts: "defer" | "async";
  };
  assetOptimization: {
    fontDisplayRule: string; // e.g. "swap"
    preloadAssets: string[];
    prefetchDomains: string[];
  };
}

export interface AccessibilitySeoChecks {
  linkLabels: {
    isValid: boolean;
    warnings: string[];
  };
  imageAltTextStatus: {
    hasAlt: boolean;
    missingCount: number;
  };
  ariaLabelsStatus: {
    isValid: boolean;
    issues: string[];
  };
  contrastTargetsMet: boolean;
  screenReaderCues: string[];
  wcagLevel: "AA" | "AAA";
}

export interface SeoScores {
  metadata: number; // 0-100
  content: number;
  technical: number;
  structuredData: number;
  accessibility: number;
  performance: number;
  socialSharing: number;
  urlStructure: number;
  readability: number;
  keywordOptimization: number;
  overall: number;
}

export interface SEOBlueprint {
  blueprintId: string;
  userId: string;
  builderId: string;
  planId: string;
  metadata: PageMetadata;
  structuredData: StructuredDataSchemas;
  social: SocialMetadata;
  urlRules: UrlRules;
  contentAnalysis: ContentSeoChecklist;
  technicalRules: TechnicalSeoRules;
  accessibility: AccessibilitySeoChecks;
  scores: SeoScores;
  version: string;
  timestamp: string;
}

export type SeoPipelineStatus =
  | "idle"
  | "processing_input"
  | "compiling_metadata"
  | "compiling_schemas"
  | "compiling_social"
  | "compiling_urls"
  | "analyzing_content"
  | "compiling_technical"
  | "compiling_accessibility"
  | "scoring"
  | "completed"
  | "failed";
