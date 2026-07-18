import { PlanPage, PlanSection, NavigationConfig, SEOMetadataPlan, ResponsiveStrategy, ContentGenerationRequirement } from "./architect-types";

// Dynamic page slugs list
export const BASE_SLUGS = {
  home: "/",
  about: "/about",
  services: "/services",
  projects: "/projects",
  experience: "/experience",
  testimonials: "/testimonials",
  contact: "/contact",
};

/**
 * Creates default responsive layout strategies for pages.
 */
export function getResponsiveStrategy(sectionType: string): ResponsiveStrategy {
  const isGridHeavy = ["services", "projects", "skills"].includes(sectionType);
  return {
    mobileFirst: true,
    stackingBreakpoints: ["sm", "md"],
    columnLayouts: {
      mobile: 1,
      tablet: isGridHeavy ? 2 : 1,
      desktop: isGridHeavy ? 3 : 1,
    },
  };
}

/**
 * Generates an SEO plan for a specific page based on wizard details and custom preferences.
 */
export function buildSEOPlan(
  pageName: string,
  slug: string,
  personalInfo: Record<string, any>,
  businessIdentity: Record<string, any>,
  seoInfo: Record<string, any>
): SEOMetadataPlan {
  const fullName = personalInfo.fullName || "Professional";
  const profession = personalInfo.profession || "Expert";
  const brandName = businessIdentity.brandName || `${fullName} Portfolio`;
  const websiteTitle = businessIdentity.websiteTitle || `${brandName} - ${profession}`;
  
  let title = `${pageName} | ${websiteTitle}`;
  if (slug === "/") {
    title = websiteTitle;
  }

  // Generate page-specific descriptions
  let description = seoInfo.metaDescription || `Explore the professional developer portfolio of ${fullName}, specializing in ${profession}.`;
  if (slug === "/projects") {
    description = `View selected professional case studies, GitHub repositories, and web applications built by ${fullName}.`;
  } else if (slug === "/services") {
    description = `Discover consulting offers, freelance service rates, packages, and technical capabilities provided by ${fullName}.`;
  } else if (slug === "/about") {
    description = `Learn more about the professional story, education background, career journey, and core values of ${fullName}.`;
  }

  const baseKeywords = [
    fullName.toLowerCase(),
    profession.toLowerCase(),
    "portfolio",
    "developer",
    "freelance",
    "resume",
  ];
  if (seoInfo.metaKeywords) {
    seoInfo.metaKeywords.split(",").forEach((k: string) => {
      const trimmed = k.trim().toLowerCase();
      if (trimmed && !baseKeywords.includes(trimmed)) {
        baseKeywords.push(trimmed);
      }
    });
  }

  return {
    title,
    description,
    keywords: baseKeywords,
    ogImage: personalInfo.photoUrl || seoInfo.ogImageUrl || "",
    ogType: slug === "/" ? "profile" : "website",
    structuredDataHint: slug === "/" ? "Person" : "WebPage" as any,
  };
}

/**
 * Derives content requirements for a section to direct future copy-writing actions.
 */
export function buildContentRequirement(
  sectionType: string,
  personalInfo: Record<string, any>,
  toneDirective: string
): ContentGenerationRequirement {
  const fullName = personalInfo.fullName || "User";
  const profession = personalInfo.profession || "Expert";

  const requirementMap: Record<string, { intent: string; words: number; vars: string[] }> = {
    hero: {
      intent: `Generate an attention-grabbing hero title, hook tagline, and introduction copy positioned for ${fullName} acting as a ${profession}.`,
      words: 60,
      vars: ["fullName", "headline", "profession", "availability"],
    },
    about: {
      intent: `Generate a compelling profile narrative, key career highlights, and values statements that illustrate ${fullName}'s strengths.`,
      words: 150,
      vars: ["fullName", "aboutMe", "journey", "passion"],
    },
    services: {
      intent: "Describe client-facing technical solutions, delivery timeframes, and business value propositions clearly.",
      words: 100,
      vars: ["services"],
    },
    projects: {
      intent: "Summarize selected challenges, technical solutions, architecture choices, and measurable outcomes.",
      words: 120,
      vars: ["projects"],
    },
    experience: {
      intent: "Summarize major achievements, responsibilities, and technical stacks utilized at previous job roles.",
      words: 80,
      vars: ["experience"],
    },
    testimonials: {
      intent: "Highlight peer validation, professional integrity, speed of execution, and client satisfaction outcomes.",
      words: 50,
      vars: ["testimonials"],
    },
    contact: {
      intent: "Call to action urging prospective employers or clients to get in touch for collaborations or hires.",
      words: 30,
      vars: ["email", "phone", "availability"],
    },
  };

  const req = requirementMap[sectionType] || {
    intent: `Develop clear copywriting for the ${sectionType} section focusing on professional strengths.`,
    words: 80,
    vars: [],
  };

  return {
    sectionKey: `${sectionType}Req`,
    promptIntent: req.intent,
    targetWordCount: req.words,
    toneDirective,
    inputVariablesUsed: req.vars,
  };
}

/**
 * Deterministically constructs page structural plans using wizard selections and blueprint priorities.
 */
export function buildPageArchitecture(
  websiteData: Record<string, any>,
  aiBlueprint: any
): PlanPage[] {
  const pages: PlanPage[] = [];
  
  const personal = websiteData.personalInfo || {};
  const business = websiteData.businessIdentity || {};
  const extraPages = websiteData.extraPages || {};
  const seo = websiteData.seoInfo || {};
  const tone = aiBlueprint?.contentAnalysis?.tone || "Modern & Technical";

  // Heuristics: determine if page is essential based on inputs
  const hasServices = (websiteData.services?.services?.length || 0) > 0 || extraPages.services;
  const hasProjects = (websiteData.projects?.projects?.length || 0) > 0 || extraPages.projects;
  const hasTestimonials = (websiteData.testimonials?.testimonials?.length || 0) > 0 || extraPages.testimonials;

  // 1. Home Page (Always essential)
  const homeSections: PlanSection[] = [
    {
      id: "home-hero",
      type: "hero",
      componentSuggestion: "hero-split",
      title: personal.headline || `Welcome to ${personal.fullName || "My Portfolio"}`,
      subtitle: personal.specialization || "Professional Portfolio Layout",
      orderWeight: 10,
      contentRequirement: buildContentRequirement("hero", personal, tone),
    },
    {
      id: "home-about",
      type: "about",
      componentSuggestion: "about-split",
      title: "About Me",
      orderWeight: 20,
      contentRequirement: buildContentRequirement("about", personal, tone),
    },
  ];

  if (hasServices) {
    homeSections.push({
      id: "home-services-teaser",
      type: "services",
      componentSuggestion: "services-grid",
      title: "Featured Services",
      subtitle: "What I offer to clients and teams",
      orderWeight: 30,
      contentRequirement: buildContentRequirement("services", personal, tone),
    });
  }

  if (hasProjects) {
    homeSections.push({
      id: "home-projects-teaser",
      type: "projects",
      componentSuggestion: "projects-grid-featured",
      title: "Selected Projects",
      subtitle: "Recent work and case studies",
      orderWeight: 40,
      contentRequirement: buildContentRequirement("projects", personal, tone),
    });
  }

  if (hasTestimonials) {
    homeSections.push({
      id: "home-testimonials-teaser",
      type: "testimonials",
      componentSuggestion: "testimonials-slider",
      title: "Client Testimonials",
      orderWeight: 50,
      contentRequirement: buildContentRequirement("testimonials", personal, tone),
    });
  }

  homeSections.push({
    id: "home-contact",
    type: "contact",
    componentSuggestion: "contact-form",
    title: "Get In Touch",
    subtitle: "Let's collaborate on your next project",
    orderWeight: 100,
    contentRequirement: buildContentRequirement("contact", personal, tone),
  });

  // Sort sections by weight
  homeSections.sort((a, b) => a.orderWeight - b.orderWeight);

  pages.push({
    name: "Home",
    slug: BASE_SLUGS.home,
    priority: "essential",
    description: "Main portfolio landing page detailing summary, values, featured projects, and contact channels.",
    sections: homeSections,
    seoPlan: buildSEOPlan("Home", BASE_SLUGS.home, personal, business, seo),
    responsiveStrategy: getResponsiveStrategy("home"),
  });

  // 2. Projects Page (If explicit extra page selected, or has project entries)
  if (hasProjects || extraPages.projects) {
    pages.push({
      name: "Projects",
      slug: BASE_SLUGS.projects,
      priority: hasProjects ? "essential" : "recommended",
      description: "Dedicated gallery listing all completed development works, case studies, and code links.",
      sections: [
        {
          id: "projects-intro",
          type: "hero",
          componentSuggestion: "hero-centered",
          title: "My Portfolio Projects",
          subtitle: "A detailed log of tools and systems built.",
          orderWeight: 10,
        },
        {
          id: "projects-gallery",
          type: "projects",
          componentSuggestion: "projects-grid",
          title: "All Work Case Studies",
          orderWeight: 20,
          contentRequirement: buildContentRequirement("projects", personal, tone),
        },
      ],
      seoPlan: buildSEOPlan("Projects", BASE_SLUGS.projects, personal, business, seo),
      responsiveStrategy: getResponsiveStrategy("projects"),
    });
  }

  // 3. Services Page (If services configured or extra page active)
  if (hasServices || extraPages.services) {
    pages.push({
      name: "Services",
      slug: BASE_SLUGS.services,
      priority: hasServices ? "essential" : "recommended",
      description: "Overview of service offerings, consulting tiers, hourly ranges, and deliverables.",
      sections: [
        {
          id: "services-intro",
          type: "hero",
          componentSuggestion: "hero-centered",
          title: "Professional Services",
          subtitle: "Custom consulting, engineering, and support strategies.",
          orderWeight: 10,
        },
        {
          id: "services-list",
          type: "services",
          componentSuggestion: "services-cards-detailed",
          title: "What I Do",
          orderWeight: 20,
          contentRequirement: buildContentRequirement("services", personal, tone),
        },
      ],
      seoPlan: buildSEOPlan("Services", BASE_SLUGS.services, personal, business, seo),
      responsiveStrategy: getResponsiveStrategy("services"),
    });
  }

  return pages;
}

/**
 * Prepares navigation configuration matching layout preference styles.
 */
export function buildNavigationConfig(
  pages: PlanPage[],
  preferences: Record<string, any>
): NavigationConfig {
  const menuItems = pages.map((p) => ({
    label: p.name,
    path: p.slug,
  }));

  return {
    navigationStyle: preferences.navigationStyle || "Top Navbar",
    menuItems,
    ctaButton: {
      label: "Contact Me",
      actionType: "scroll_to_contact",
      target: "#contact",
    },
    sticky: preferences.headerLayout !== "Simple Top",
  };
}
