import React from "react";
import { PortfolioRenderingEngine } from "@/lib/rendering-engine/engine/portfolio-rendering-engine";
import { ThemeWrapper } from "./ThemeWrapper";
import { SectionRenderer } from "./SectionRenderer";

export interface PortfolioRendererProps {
  blueprint: any;
}

export function PortfolioRenderer({ blueprint }: PortfolioRendererProps) {
  const report = PortfolioRenderingEngine.prepareRenderContext(blueprint);

  if (!report.success || !report.context) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-2xl font-bold text-destructive">Portfolio Rendering Error</h2>
          <p className="text-sm text-muted-foreground">{report.errors.join("; ") || "Failed to render portfolio blueprint."}</p>
        </div>
      </div>
    );
  }

  const { context } = report;

  return (
    <ThemeWrapper cssVariables={context.cssVariables} isDarkMode={context.isDarkMode}>
      <div className="relative min-h-screen">
        {context.sections.map((node) => (
          <SectionRenderer key={node.id} node={node} mainNav={context.mainNav} />
        ))}
      </div>
    </ThemeWrapper>
  );
}
