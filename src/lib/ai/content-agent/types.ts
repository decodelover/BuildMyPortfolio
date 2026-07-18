export interface PortfolioInputData {
  personalInfo?: Record<string, any>;
  businessIdentity?: Record<string, any>;
  professionalStory?: Record<string, any>;
  services?: Record<string, any>;
  projects?: Record<string, any>;
  experience?: Record<string, any>;
  education?: Record<string, any>;
  skills?: Record<string, any>;
  testimonials?: Record<string, any>;
  socialLinks?: Record<string, any>;
  websitePreferences?: Record<string, any>;
  extraPages?: Record<string, any>;
  seoInfo?: Record<string, any>;
  websiteReview?: Record<string, any>;
}

export interface NormalizedPortfolioData {
  personal: {
    fullName: string;
    profession: string;
    headline: string;
    bioSummary: string;
    email: string;
    phone: string;
    location: string;
    avatarUrl?: string;
  };
  story: {
    backgroundSummary: string;
    careerMilestones: string[];
    coreValues: string[];
    yearsOfExperience: number;
  };
  skills: Array<{
    name: string;
    category: string;
    level: "expert" | "intermediate" | "beginner";
  }>;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    role: string;
    technologies: string[];
    liveUrl?: string;
    githubUrl?: string;
    imageUrl?: string;
    featured: boolean;
  }>;
  experience: Array<{
    id: string;
    company: string;
    role: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
    technologies: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
  }>;
  services: Array<{
    id: string;
    title: string;
    description: string;
    features: string[];
    price?: string;
  }>;
  testimonials: Array<{
    id: string;
    clientName: string;
    clientRole: string;
    clientCompany?: string;
    feedback: string;
    avatarUrl?: string;
  }>;
  socials: Record<string, string>;
  preferences: {
    themeId: string;
    borderRadius: string;
    logoPlacement: string;
    tone: string[];
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
  };
}

export type ContentBlockType =
  | "hero"
  | "about"
  | "career-objective"
  | "project-descriptions"
  | "experience-descriptions"
  | "achievement-highlights"
  | "skills-summary"
  | "service-descriptions"
  | "cta"
  | "headlines"
  | "section-intros"
  | "testimonials-formatting"
  | "faq"
  | "contact-copy"
  | "footer-copy"
  | "blog-intro"
  | "portfolio-tagline"
  | "professional-bio";

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  title: string;
  content: Record<string, any>;
  status: "draft" | "ready" | "error";
  source: string; // E.g. "ai-gemini", "mock-provider"
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
  validationScore?: number;
  qualityScore?: number;
}

export type ContentTaskPriority = "critical" | "high" | "medium" | "low";

export type ContentTaskStatus = "pending" | "queued" | "running" | "completed" | "failed" | "skipped";

export interface ContentTask {
  id: string;
  type: ContentBlockType;
  priority: ContentTaskPriority;
  dependencies: ContentBlockType[];
  status: ContentTaskStatus;
  retryCount: number;
  maxRetries: number;
  executionTime?: number; // in ms
  error?: string | null;
  metadata?: Record<string, any>;
}

export type PipelineStatus =
  | "idle"
  | "validating"
  | "normalizing"
  | "generating_tasks"
  | "executing"
  | "completed"
  | "failed";

export type ValidationSeverity = "error" | "warning" | "info";

export interface ValidationIssue {
  field: string;
  message: string;
  severity: ValidationSeverity;
}

export interface PortfolioValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  completenessScore: number;
}

export interface ContentResult {
  blocks: ContentBlock[];
  metadata: {
    pipelineVersion: string;
    completedAt: string;
    totalTasks: number;
    failedTasks: number;
    executionTimeMs: number;
    overallQualityScore: number;
  };
}
