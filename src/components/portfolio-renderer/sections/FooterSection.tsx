import React from "react";
import { NormalizedSectionNode } from "@/lib/rendering-engine/types";

export function FooterSection({ node }: { node: NormalizedSectionNode }) {
  const content = node.content || {};

  return (
    <footer id="footer" className="border-t border-border/40 bg-card/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <p>{content.copyright || `© ${new Date().getFullYear()} Portfolio. All rights reserved.`}</p>
        <div className="flex items-center gap-6 font-medium">
          <a href="#hero" className="hover:underline">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
