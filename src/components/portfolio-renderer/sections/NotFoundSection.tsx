import React from "react";
import { NormalizedSectionNode } from "@/lib/rendering-engine/types";
import { PortfolioButton } from "../ui/PortfolioButton";

export function NotFoundSection({ node }: { node: NormalizedSectionNode }) {
  const content = node.content || {};

  return (
    <section className="py-32 text-center max-w-lg mx-auto px-4 space-y-6">
      <div className="text-6xl font-black text-primary">404</div>
      <h1 className="text-2xl font-bold text-foreground">{content.title || "Page Not Found"}</h1>
      <p className="text-sm text-muted-foreground">{content.message || "The page you are looking for does not exist."}</p>
      <a href={content.ctaTarget || "/"}>
        <PortfolioButton variant="primary">{content.ctaLabel || "Back to Home"}</PortfolioButton>
      </a>
    </section>
  );
}
