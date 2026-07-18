import { ContentTask, NormalizedPortfolioData, ContentBlockType } from "../types";

export class TaskGenerator {
  
  public static generate(data: NormalizedPortfolioData): ContentTask[] {
    const tasks: ContentTask[] = [];

    // Helper to push task structure
    const addTask = (
      type: ContentBlockType,
      priority: ContentTask["priority"],
      dependencies: ContentBlockType[] = [],
      metadata?: Record<string, any>
    ) => {
      tasks.push({
        id: `task-${type}-${Date.now()}`,
        type,
        priority,
        dependencies,
        status: "pending",
        retryCount: 0,
        maxRetries: 3,
        metadata
      });
    };

    // 1. Core structural layout tasks (Critical priority, no dependencies)
    addTask("headlines", "critical", []);
    addTask("portfolio-tagline", "critical", []);

    // 2. Main content blocks (High priority)
    addTask("hero", "high", ["headlines"]);
    addTask("about", "high", ["portfolio-tagline"]);
    addTask("professional-bio", "high", []);

    // 3. Detailed sections (Medium priority)
    addTask("career-objective", "medium", ["about"]);
    
    if (data.projects.length > 0) {
      addTask("project-descriptions", "medium", ["about"]);
    }
    if (data.experience.length > 0) {
      addTask("experience-descriptions", "medium", ["about"]);
      addTask("achievement-highlights", "medium", ["experience-descriptions"]);
    }
    if (data.skills.length > 0) {
      addTask("skills-summary", "medium", ["about"]);
    }
    if (data.services.length > 0) {
      addTask("service-descriptions", "medium", ["about"]);
    }

    // 4. Supporting panels & Footers (Low priority)
    addTask("section-intros", "low", ["hero"]);
    
    if (data.testimonials.length > 0) {
      addTask("testimonials-formatting", "low", ["about"]);
    }
    
    addTask("faq", "low", []);
    addTask("contact-copy", "low", ["headlines"]);
    addTask("footer-copy", "low", ["portfolio-tagline"]);
    addTask("blog-intro", "low", ["about"]);

    return tasks;
  }
}
