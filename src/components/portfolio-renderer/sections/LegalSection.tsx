import React from "react";
import { NormalizedSectionNode } from "@/lib/rendering-engine/types";
import { PortfolioCard } from "../ui/PortfolioCard";

export function LegalSection({ node }: { node: NormalizedSectionNode }) {
  const content = node.content || {};

  return (
    <section className="py-16 lg:py-24 max-w-4xl mx-auto px-4 space-y-8">
      <h1 className="text-3xl font-black text-foreground">{content.title || "Legal & Privacy Policy"}</h1>
      <PortfolioCard className="space-y-6 text-sm text-foreground/80 leading-relaxed">
        <div>
          <h3 className="text-base font-bold text-foreground mb-2">Privacy Policy</h3>
          <p>{content.privacyPolicy || "This portfolio website respects your privacy. No personal identification data is collected without explicit consent."}</p>
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground mb-2">Terms of Service</h3>
          <p>{content.termsOfService || "All work samples and trademarks belong to their respective owners."}</p>
        </div>
      </PortfolioCard>
    </section>
  );
}
