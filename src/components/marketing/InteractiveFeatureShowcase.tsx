"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Palette, Search, ShieldCheck, Globe, Code, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function InteractiveFeatureShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      id: "ai-copywriter",
      title: "AI Copywriting & Summarizer",
      icon: Sparkles,
      badge: "Gemini AI LLM",
      color: "text-accent bg-accent/10 border-accent/20",
      description: "Auto-generate high-impact developer bios, project achievements, and work experience summaries tailored for engineering recruiters.",
      snippet: `// AI Content Agent Output
{
  "role": "Senior Full-Stack Architect",
  "summary": "Specializing in Next.js 15, TypeScript, microservices, and distributed cloud engines...",
  "impactKeywords": ["Topological DAG", "Lighthouse 100", "99.9% SLA"]
}`,
    },
    {
      id: "theme-engine",
      title: "Glassmorphism Theme System",
      icon: Palette,
      badge: "Design System",
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      description: "Switch seamlessly between Cyberpunk Obsidian, Brutalist Neon, Creative Aurora, and Minimalist Slate presets.",
      snippet: `// Compiled Theme Blueprint
export const themeBlueprint = {
  themeId: "cyberpunk-obsidian",
  background: "bg-zinc-950",
  accentGlow: "cyan-400",
  typography: "JetBrains Mono + Inter"
};`,
    },
    {
      id: "technical-seo",
      title: "Lighthouse 100 Technical SEO",
      icon: Search,
      badge: "SEO Engine",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      description: "Auto-inject JSON-LD structured schemas, OpenGraph card previews, canonical links, and optimized sitemaps.",
      snippet: `<!-- Generated JSON-LD Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Alex Rivera",
  "jobTitle": "Full-Stack Engineer"
}
</script>`,
    },
    {
      id: "qa-audit",
      title: "Automated Quality Assurance",
      icon: ShieldCheck,
      badge: "QA Scanner",
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      description: "Every site is scanned for WCAG AA color contrast compliance, keyboard accessibility, and zero broken links.",
      snippet: `// Automated QA Audit Report
{
  "accessibilityScore": 100,
  "coreWebVitalsLCP": "0.68s",
  "brokenLinks": 0,
  "status": "PASSED"
}`,
    },
  ];

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden text-center select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-wider">
            Interactive Feature Showcase
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Explore the Core Technologies
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            Click through the feature modules to preview how BuildMyPortfolio compiles and deploys your site.
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="flex items-center justify-center gap-3 overflow-x-auto no-scrollbar max-w-4xl mx-auto">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap border",
                  activeTab === idx
                    ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                    : "bg-card border-border/60 text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{f.title}</span>
              </button>
            );
          })}
        </div>

        {/* Feature Content Display */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-border/60 bg-card/70 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl grid grid-cols-1 md:grid-cols-2 gap-8 text-left items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${features[activeTab].color}`}>
                  {features[activeTab].badge}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">Module 0{activeTab + 1}</span>
              </div>

              <h3 className="text-2xl font-black text-foreground">{features[activeTab].title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                {features[activeTab].description}
              </p>

              <div className="pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:opacity-90 transition-opacity"
                >
                  Test This Feature <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Interactive Code Snippet Box */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-border/60 bg-background/90 p-4 font-mono text-xs text-foreground shadow-inner space-y-2"
            >
              <div className="flex items-center justify-between text-[10px] text-muted-foreground border-b border-border/40 pb-2">
                <span className="flex items-center gap-1.5 font-bold text-primary">
                  <Code className="h-3.5 w-3.5" /> Code Blueprint Output
                </span>
                <span className="text-emerald-500 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Validated
                </span>
              </div>
              <pre className="text-[11px] text-muted-foreground leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {features[activeTab].snippet}
              </pre>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
