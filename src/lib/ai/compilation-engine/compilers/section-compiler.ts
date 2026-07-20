import {
  CompilationContext,
  BlueprintNode,
  BlueprintSectionType,
  ComponentRef,
  ConflictResolution
} from "../types";
import { CompilationConfig } from "../config/compilation-config";
import { SectionCompilationError } from "../errors/compilation-errors";

export class SectionCompiler {
  public static compile(
    context: CompilationContext,
    componentRefs: Record<string, ComponentRef>,
    resolutions: ConflictResolution[]
  ): BlueprintNode[] {
    const nodes: BlueprintNode[] = [];
    const normalized = context.normalizedData;
    const contentBlocks = context.contentBlocks || [];
    const design = context.designBlueprint;
    const rawInput = context.rawInput || {};

    // Helper to extract content block by type
    const findContentBlock = (type: string) => {
      return contentBlocks.find((b) => b.type === type || b.id.includes(type))?.content || {};
    };

    // Determine section list and ordering from design layouts or fallback default weights
    const layouts = design?.layouts || [];
    
    // All possible section definitions
    const sectionDefinitions: Array<{
      id: string;
      type: BlueprintSectionType;
      defaultTitle: string;
      getContent: () => Record<string, any>;
    }> = [
      {
        id: "sec-navigation",
        type: "navigation",
        defaultTitle: "Navigation",
        getContent: () => ({
          logoText: normalized.personal?.fullName || "Portfolio",
          tagline: normalized.personal?.profession || "",
          avatarUrl: normalized.personal?.avatarUrl || "",
          socials: normalized.socials || {}
        })
      },
      {
        id: "sec-hero",
        type: "hero",
        defaultTitle: "Hero",
        getContent: () => ({
          fullName: normalized.personal?.fullName || "Professional Developer",
          profession: normalized.personal?.profession || "Full-Stack Engineer",
          headline: normalized.personal?.headline || findContentBlock("hero")?.headline || "Building Digital Products that Matter",
          bioSummary: normalized.personal?.bioSummary || findContentBlock("hero")?.subheadline || "Experienced software engineer passionate about clean code and modern web design.",
          email: normalized.personal?.email || "",
          avatarUrl: normalized.personal?.avatarUrl || "",
          location: normalized.personal?.location || "",
          ctaPrimary: { label: "View Projects", target: "#projects" },
          ctaSecondary: { label: "Contact Me", target: "#contact" }
        })
      },
      {
        id: "sec-about",
        type: "about",
        defaultTitle: "About Me",
        getContent: () => ({
          title: "About Me",
          bioSummary: normalized.personal?.bioSummary || findContentBlock("about")?.bio || "Passionate about creating scalable applications.",
          backgroundSummary: normalized.story?.backgroundSummary || findContentBlock("about")?.story || "",
          careerMilestones: normalized.story?.careerMilestones || [],
          coreValues: normalized.story?.coreValues || ["Quality", "Innovation", "Integrity"],
          yearsOfExperience: normalized.story?.yearsOfExperience || 5,
          location: normalized.personal?.location || "",
          email: normalized.personal?.email || ""
        })
      },
      {
        id: "sec-skills",
        type: "skills",
        defaultTitle: "Skills & Expertise",
        getContent: () => ({
          title: "Skills & Expertise",
          skillsList: normalized.skills && normalized.skills.length > 0
            ? normalized.skills
            : [
                { name: "TypeScript", category: "Languages", level: "expert" },
                { name: "React / Next.js", category: "Frontend", level: "expert" },
                { name: "Node.js", category: "Backend", level: "expert" },
                { name: "Tailwind CSS", category: "Styling", level: "expert" }
              ]
        })
      },
      {
        id: "sec-projects",
        type: "projects",
        defaultTitle: "Featured Projects",
        getContent: () => ({
          title: "Featured Projects",
          projectsList: normalized.projects && normalized.projects.length > 0
            ? normalized.projects
            : []
        })
      },
      {
        id: "sec-experience",
        type: "experience",
        defaultTitle: "Work Experience",
        getContent: () => ({
          title: "Work Experience",
          experienceList: normalized.experience && normalized.experience.length > 0
            ? normalized.experience
            : []
        })
      },
      {
        id: "sec-education",
        type: "education",
        defaultTitle: "Education",
        getContent: () => ({
          title: "Education",
          educationList: normalized.education && normalized.education.length > 0
            ? normalized.education
            : []
        })
      },
      {
        id: "sec-services",
        type: "services",
        defaultTitle: "Services Offered",
        getContent: () => ({
          title: "Services Offered",
          servicesList: normalized.services && normalized.services.length > 0
            ? normalized.services
            : []
        })
      },
      {
        id: "sec-testimonials",
        type: "testimonials",
        defaultTitle: "Testimonials & Reviews",
        getContent: () => ({
          title: "Client Testimonials",
          testimonialsList: normalized.testimonials && normalized.testimonials.length > 0
            ? normalized.testimonials
            : []
        })
      },
      {
        id: "sec-certifications",
        type: "certifications",
        defaultTitle: "Certifications",
        getContent: () => ({
          title: "Certifications & Credentials",
          certificationsList: rawInput.certifications || []
        })
      },
      {
        id: "sec-statistics",
        type: "statistics",
        defaultTitle: "Key Metrics",
        getContent: () => ({
          title: "By the Numbers",
          metrics: [
            { label: "Years Experience", value: `${normalized.story?.yearsOfExperience || 5}+` },
            { label: "Projects Completed", value: `${normalized.projects?.length || 10}+` },
            { label: "Satisfied Clients", value: `${normalized.testimonials?.length || 12}+` }
          ]
        })
      },
      {
        id: "sec-resume",
        type: "resume",
        defaultTitle: "Resume",
        getContent: () => ({
          title: "Curriculum Vitae",
          description: "Download or view my complete professional resume.",
          downloadUrl: rawInput.resumeUrl || "#"
        })
      },
      {
        id: "sec-contact",
        type: "contact",
        defaultTitle: "Get In Touch",
        getContent: () => ({
          title: "Get In Touch",
          subtitle: "Have a project in mind or want to collaborate? Reach out!",
          email: normalized.personal?.email || "",
          phone: normalized.personal?.phone || "",
          location: normalized.personal?.location || "",
          socials: normalized.socials || {}
        })
      },
      {
        id: "sec-footer",
        type: "footer",
        defaultTitle: "Footer",
        getContent: () => ({
          copyright: `© ${new Date().getFullYear()} ${normalized.personal?.fullName || "Portfolio"}. All rights reserved.`,
          fullName: normalized.personal?.fullName || "",
          profession: normalized.personal?.profession || "",
          socials: normalized.socials || {}
        })
      },
      {
        id: "sec-not-found",
        type: "not-found",
        defaultTitle: "Page Not Found",
        getContent: () => ({
          title: "404 - Page Not Found",
          message: "The page you are looking for does not exist or has been moved.",
          ctaLabel: "Back to Home",
          ctaTarget: "/"
        })
      },
      {
        id: "sec-legal",
        type: "legal",
        defaultTitle: "Privacy Policy & Terms",
        getContent: () => ({
          title: "Legal & Privacy",
          privacyPolicy: "This portfolio respects your privacy. No personal data is stored without consent.",
          termsOfService: "Content and code samples presented herein are for demonstration and portfolio purposes."
        })
      }
    ];

    // Filter and compile sections based on available content or explicit layouts
    sectionDefinitions.forEach((sec) => {
      const layoutMatch = layouts.find((l) => l.type === sec.type || l.sectionId === sec.id);
      const orderWeight = layoutMatch
        ? layoutMatch.orderWeight
        : CompilationConfig.defaultSectionWeights[sec.type] ?? 999;

      const compRef = componentRefs[sec.id] || {
        componentId: `comp-${sec.type}-${sec.id}`,
        variant: "default",
        props: {},
        interactiveFeatures: []
      };

      const sectionContent = sec.getContent();

      // Check section styles from design layout
      const styles = {
        gridColumns: layoutMatch?.gridColumns || { mobile: 1, tablet: 2, desktop: 3 },
        layoutVariant: layoutMatch?.layoutVariant || "standard"
      };

      nodes.push({
        id: sec.id,
        type: sec.type,
        order: orderWeight,
        title: sec.defaultTitle,
        content: sectionContent,
        componentRef: compRef,
        styles,
        responsive: {
          visible: true
        },
        animation: {
          reveal: "fade-up",
          delayMs: orderWeight * 10
        },
        accessibility: {
          role: sec.type === "navigation" ? "navigation" : sec.type === "hero" ? "banner" : "region",
          ariaLabel: sec.defaultTitle
        }
      });
    });

    // Sort nodes by order weight
    nodes.sort((a, b) => a.order - b.order);

    if (nodes.length === 0) {
      throw new SectionCompilationError("Failed to compile any valid portfolio blueprint section nodes.");
    }

    return nodes;
  }
}
