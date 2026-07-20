import React from "react";
import { NormalizedSectionNode } from "@/lib/rendering-engine/types";
import { AnimationWrapper } from "./AnimationWrapper";

import { HeroSection } from "./sections/HeroSection";
import { AboutSection } from "./sections/AboutSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { SkillsSection } from "./sections/SkillsSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { EducationSection } from "./sections/EducationSection";
import { CertificationsSection } from "./sections/CertificationsSection";
import { ServicesSection } from "./sections/ServicesSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { GallerySection } from "./sections/GallerySection";
import { StatisticsSection } from "./sections/StatisticsSection";
import { ResumeSection } from "./sections/ResumeSection";
import { BlogSection } from "./sections/BlogSection";
import { ContactSection } from "./sections/ContactSection";
import { NavbarSection } from "./sections/NavbarSection";
import { FooterSection } from "./sections/FooterSection";
import { NotFoundSection } from "./sections/NotFoundSection";
import { LegalSection } from "./sections/LegalSection";

export interface SectionRendererProps {
  node: NormalizedSectionNode;
  mainNav?: Array<{ label: string; target: string; isExternal: boolean }>;
}

export function SectionRenderer({ node, mainNav }: SectionRendererProps) {
  const renderSectionContent = () => {
    switch (node.type) {
      case "navigation":
        return <NavbarSection node={node} mainNav={mainNav} />;
      case "hero":
        return <HeroSection node={node} />;
      case "about":
        return <AboutSection node={node} />;
      case "projects":
        return <ProjectsSection node={node} />;
      case "skills":
        return <SkillsSection node={node} />;
      case "experience":
        return <ExperienceSection node={node} />;
      case "education":
        return <EducationSection node={node} />;
      case "certifications":
        return <CertificationsSection node={node} />;
      case "services":
        return <ServicesSection node={node} />;
      case "testimonials":
        return <TestimonialsSection node={node} />;
      case "gallery":
        return <GallerySection node={node} />;
      case "statistics":
        return <StatisticsSection node={node} />;
      case "resume":
        return <ResumeSection node={node} />;
      case "blog":
        return <BlogSection node={node} />;
      case "contact":
        return <ContactSection node={node} />;
      case "footer":
        return <FooterSection node={node} />;
      case "not-found":
        return <NotFoundSection node={node} />;
      case "legal":
        return <LegalSection node={node} />;
      default:
        return <HeroSection node={node} />;
    }
  };

  // Navbar and Footer don't require scroll reveal animation wrapper
  if (node.type === "navigation" || node.type === "footer") {
    return renderSectionContent();
  }

  return (
    <AnimationWrapper animationConfig={node.animationConfig}>
      {renderSectionContent()}
    </AnimationWrapper>
  );
}
