import { ContentBlockType, ContentTaskPriority } from "../types";

export interface TaskTypeConfig {
  priority: ContentTaskPriority;
  maxRetries: number;
  timeoutMs: number;
  dependencies: ContentBlockType[];
}

export class ContentAgentConfig {
  public static readonly defaultMaxRetries = 3;
  public static readonly defaultTimeoutMs = 15000;
  
  public static readonly tasks: Record<ContentBlockType, TaskTypeConfig> = {
    headlines: { priority: "critical", maxRetries: 3, timeoutMs: 10000, dependencies: [] },
    "portfolio-tagline": { priority: "critical", maxRetries: 3, timeoutMs: 10000, dependencies: [] },
    hero: { priority: "high", maxRetries: 3, timeoutMs: 15000, dependencies: ["headlines"] },
    about: { priority: "high", maxRetries: 3, timeoutMs: 15000, dependencies: ["portfolio-tagline"] },
    "professional-bio": { priority: "high", maxRetries: 3, timeoutMs: 15000, dependencies: [] },
    "career-objective": { priority: "medium", maxRetries: 3, timeoutMs: 10000, dependencies: ["about"] },
    "project-descriptions": { priority: "medium", maxRetries: 3, timeoutMs: 20000, dependencies: ["about"] },
    "experience-descriptions": { priority: "medium", maxRetries: 3, timeoutMs: 20000, dependencies: ["about"] },
    "achievement-highlights": { priority: "medium", maxRetries: 3, timeoutMs: 12000, dependencies: ["experience-descriptions"] },
    "skills-summary": { priority: "medium", maxRetries: 3, timeoutMs: 12000, dependencies: ["about"] },
    "service-descriptions": { priority: "medium", maxRetries: 3, timeoutMs: 15000, dependencies: ["about"] },
    "section-intros": { priority: "low", maxRetries: 3, timeoutMs: 10000, dependencies: ["hero"] },
    "testimonials-formatting": { priority: "low", maxRetries: 3, timeoutMs: 12000, dependencies: ["about"] },
    faq: { priority: "low", maxRetries: 3, timeoutMs: 12000, dependencies: [] },
    "contact-copy": { priority: "low", maxRetries: 3, timeoutMs: 10000, dependencies: ["headlines"] },
    "footer-copy": { priority: "low", maxRetries: 3, timeoutMs: 8000, dependencies: ["portfolio-tagline"] },
    "blog-intro": { priority: "low", maxRetries: 3, timeoutMs: 12000, dependencies: ["about"] },
    cta: { priority: "low", maxRetries: 3, timeoutMs: 10000, dependencies: [] }
  };
}
