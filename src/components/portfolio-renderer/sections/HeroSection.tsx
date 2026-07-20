import React from "react";
import { NormalizedSectionNode } from "@/lib/rendering-engine/types";
import { PortfolioButton } from "../ui/PortfolioButton";
import { PortfolioImage } from "../ui/PortfolioImage";

export interface HeroSectionProps {
  node: NormalizedSectionNode;
}

export function HeroSection({ node }: HeroSectionProps) {
  const content = node.content || {};

  return (
    <section id="hero" className={`py-20 lg:py-32 flex items-center ${node.responsiveClasses.containerWidthClass}`}>
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 w-full">
        <div className="space-y-6 max-w-2xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <span>👋 Hello, I&apos;m {content.fullName || "Developer"}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
            {content.headline || "Building Digital Products that Matter."}
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed font-normal">
            {content.bioSummary || "Experienced software engineer passionate about clean code, scalable architecture, and intuitive user experiences."}
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {content.ctaPrimary && (
              <a href={content.ctaPrimary.target || "#projects"}>
                <PortfolioButton variant="primary" size="lg">
                  {content.ctaPrimary.label || "View Projects"}
                </PortfolioButton>
              </a>
            )}
            {content.ctaSecondary && (
              <a href={content.ctaSecondary.target || "#contact"}>
                <PortfolioButton variant="outline" size="lg">
                  {content.ctaSecondary.label || "Contact Me"}
                </PortfolioButton>
              </a>
            )}
          </div>
        </div>

        {content.avatarUrl && (
          <div className="relative">
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-primary to-accent opacity-75 blur-lg animate-pulse" />
            <PortfolioImage
              src={content.avatarUrl}
              alt={content.fullName || "Profile Avatar"}
              fallbackText={content.fullName}
              className="relative h-48 w-48 sm:h-64 sm:w-64 lg:h-80 lg:w-80 rounded-full border-4 border-background shadow-2xl"
            />
          </div>
        )}
      </div>
    </section>
  );
}
