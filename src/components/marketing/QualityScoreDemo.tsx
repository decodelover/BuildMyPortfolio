"use client";

import { useState } from "react";
import { ShieldCheck, CheckCircle2, Award, Zap, BarChart2 } from "lucide-react";

export function QualityScoreDemo() {
  const metrics = [
    { label: "WCAG AA Accessibility", score: 100, desc: "Keyboard navigable, ARIA labels, high-contrast ratios." },
    { label: "Core Web Vitals Performance", score: 99, desc: "< 0.8s Largest Contentful Paint (LCP), 0 Cumulative Layout Shift." },
    { label: "Technical SEO Indexing", score: 98, desc: "JSON-LD schema, OpenGraph tags, sitemap.xml, robots.txt." },
    { label: "Content Quality Score", score: 97, desc: "Zero typos, high impact action verbs, concise professional summaries." },
  ];

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden text-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-xs font-extrabold uppercase tracking-wider">
            Automated Quality Assurance
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Enterprise Quality Assurance Built-In
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            Every portfolio built with BuildMyPortfolio undergoes automated QA scoring before deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto text-left">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-4 hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase">{m.label}</span>
                  <Award className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-foreground">{m.score}</span>
                  <span className="text-xs text-muted-foreground font-bold">/ 100</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${m.score}%` }} />
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed pt-2 border-t border-border/40 font-medium">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
