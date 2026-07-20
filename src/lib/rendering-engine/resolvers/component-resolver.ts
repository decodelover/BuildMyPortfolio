export class ComponentResolver {
  private static sectionToComponentMap: Record<string, string> = {
    hero: "HeroSection",
    about: "AboutSection",
    projects: "ProjectsSection",
    skills: "SkillsSection",
    experience: "ExperienceSection",
    education: "EducationSection",
    certifications: "CertificationsSection",
    services: "ServicesSection",
    testimonials: "TestimonialsSection",
    gallery: "GallerySection",
    statistics: "StatisticsSection",
    resume: "ResumeSection",
    blog: "BlogSection",
    contact: "ContactSection",
    navigation: "NavbarSection",
    footer: "FooterSection",
    "not-found": "NotFoundSection",
    legal: "LegalSection"
  };

  public static resolveComponentName(sectionType: string): string {
    return this.sectionToComponentMap[sectionType] || "HeroSection";
  }
}
