"use client";

import { motion } from "framer-motion";
import { Sparkles, FileText, Palette, Search, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export function WorkflowVisualization() {
  const steps = [
    {
      step: "01",
      title: "Content Agent",
      icon: FileText,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      desc: "Analyzes developer skills, projects, and career highlights to write punchy bios and project summaries.",
    },
    {
      step: "02",
      title: "Design Agent",
      icon: Palette,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
      desc: "Applies responsive design tokens, glassmorphic themes, and dynamic typography across sections.",
    },
    {
      step: "03",
      title: "SEO Agent",
      icon: Search,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      desc: "Injects structured JSON-LD schemas, high-ranking meta titles, OpenGraph cards, and canonical links.",
    },
    {
      step: "04",
      title: "QA & Publishing",
      icon: ShieldCheck,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      desc: "Executes automated WCAG accessibility scans and deploys to global edge CDN servers with automatic SSL.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden text-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-wider">
            AI Orchestration Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            How BuildMyPortfolio Compiles Your Site
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            Four specialized AI agents collaborate in parallel to build, validate, and publish your portfolio.
          </p>
        </div>

        {/* Pipeline Step Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-4 hover:border-primary/40 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center font-bold border ${s.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-mono font-extrabold text-muted-foreground/60">{s.step}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-foreground group-hover:text-primary transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/40 flex items-center gap-1.5 text-[10px] font-bold text-emerald-500">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Automated Pipeline
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
