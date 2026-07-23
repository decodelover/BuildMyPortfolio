"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Zap, Shield, BarChart3, Globe, Code, Layers, FileText, Lock } from "lucide-react";

export default function FeaturesPage() {
  const featureList = [
    {
      title: "AI AST Prompt Compiler",
      desc: "Our deep-learning orchestration agent converts raw prompt descriptions, resumes, or GitHub URLs into structured AST layout trees.",
      icon: Sparkles,
      color: "text-violet-600 bg-violet-500/10",
    },
    {
      title: "Custom Domain & Instant SSL",
      desc: "Connect your custom domain (e.g. `alexdev.com`) with automated SSL provisioning and DNS record verification.",
      icon: Globe,
      color: "text-cyan-600 bg-cyan-500/10",
    },
    {
      title: "One-Click PDF Resume Export",
      desc: "Automatically compile your portfolio sections into a high-density, ATS-friendly PDF resume.",
      icon: FileText,
      color: "text-emerald-600 bg-emerald-500/10",
    },
    {
      title: "Built-in Analytics & Visitor BI",
      desc: "Track pageview trajectories, recruiter location maps, button click conversion rates, and traffic referrals.",
      icon: BarChart3,
      color: "text-amber-600 bg-amber-500/10",
    },
    {
      title: "SEO & OpenGraph Optimizer",
      desc: "Auto-generate meta descriptions, structured JSON-LD schemas, and dynamic social share cards for LinkedIn and X.",
      icon: Code,
      color: "text-indigo-600 bg-indigo-500/10",
    },
    {
      title: "Enterprise Hardened Security",
      desc: "Built with defense-in-depth protection, Firestore data isolation, XSS prevention, and secret masking.",
      icon: Lock,
      color: "text-rose-600 bg-rose-500/10",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pt-32 pb-24 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold">
            <Zap className="w-4 h-4" /> Platform Features
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
            Everything You Need to Showcase Your Career
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Discover the full suite of AI generation engines, domain management tools, analytics dashboards, and export capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="p-8 rounded-3xl border border-border bg-card shadow-sm space-y-4 hover:border-primary/40 transition-colors">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${f.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
