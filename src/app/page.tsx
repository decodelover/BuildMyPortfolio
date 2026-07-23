"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  Globe,
  Code,
  Layers,
  CheckCircle2,
  Star,
  Play,
  Cpu,
  Terminal,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export default function HomePage() {
  const [promptInput, setPromptInput] = useState(
    "Senior Full-Stack Engineer with 6 years experience building React & Node microservices. Include GitHub project cards and a booking calendar."
  );
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);
  const [demoGenerated, setDemoGenerated] = useState(false);

  const handleSimulateDemo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingDemo(true);
    setTimeout(() => {
      setIsGeneratingDemo(false);
      setDemoGenerated(true);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
      {/* ========================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================= */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden bg-grid-pattern">
        {/* Glowing Gradient Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-600/30 to-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold animate-pulse">
            <Sparkles className="w-4 h-4 text-violet-500" />
            <span>Next-Gen AI Portfolio Builder v2.0 Released</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-5xl mx-auto leading-[1.1]">
            Build an Industry-Grade Portfolio in{" "}
            <span className="bg-gradient-to-r from-violet-600 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">
              Seconds with AI
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-normal">
            Transform your resume, GitHub profile, or prompt into a handcrafted, high-converting personal website with zero code. Designed for engineers, designers, and creators.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 rounded-2xl shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Start Building Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/templates"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-foreground bg-card hover:bg-muted border border-border rounded-2xl transition-all shadow-xs"
            >
              Explore 50+ Templates
            </Link>
          </div>

          {/* Interactive AI Prompt Mockup */}
          <div className="pt-10 max-w-4xl mx-auto">
            <div className="glow-card p-6 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-2xl text-left space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-violet-500" /> Gemini 1.5 Pro AI Engine
                </span>
              </div>

              <form onSubmit={handleSimulateDemo} className="space-y-3">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  Interactive AI Generator Prompt:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    className="flex-1 px-4 py-3 text-xs font-mono bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 text-foreground"
                  />
                  <button
                    type="submit"
                    disabled={isGeneratingDemo}
                    className="px-5 py-3 text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
                  >
                    {isGeneratingDemo ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" /> Compiling AST...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> Generate Demo
                      </>
                    )}
                  </button>
                </div>
              </form>

              {demoGenerated && (
                <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-xs space-y-2 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between text-violet-600 dark:text-violet-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Portfolio Blueprint Compiled (1.2s)
                    </span>
                    <Link href="/register" className="underline font-mono">Customize in Editor →</Link>
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    Generated modern dark theme, 4 work experience timeline cards, 6 GitHub project showcases with live preview buttons, and contact calendar integration.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. TRUST WALL & LIVE STATS */}
      {/* ========================================================= */}
      <section className="py-12 border-y border-border bg-card/40 backdrop-blur-md text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Trusted by 50,000+ engineers, designers, and creators worldwide
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1">
              <p className="text-3xl font-black text-foreground font-mono">50,000+</p>
              <p className="text-xs text-muted-foreground font-semibold">Portfolios Built</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-black text-violet-600 dark:text-violet-400 font-mono">1.2s</p>
              <p className="text-xs text-muted-foreground font-semibold">Avg AI Build Time</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-black text-cyan-600 dark:text-cyan-400 font-mono">99.99%</p>
              <p className="text-xs text-muted-foreground font-semibold">Platform Uptime</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">4.9/5.0</p>
              <p className="text-xs text-muted-foreground font-semibold">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. FEATURE HIGHLIGHTS GRID */}
      {/* ========================================================= */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 text-left">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Engineered for Creators Who Demand Excellence
          </h2>
          <p className="text-base text-muted-foreground">
            BuildMyPortfolio replaces generic website builders with an AI engine designed specifically for technical professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl border border-border bg-card shadow-sm space-y-4 hover:border-violet-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">AI AST Prompt Compiler</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Describe your career achievements or paste your GitHub URL. Our compiler converts your credentials into structured JSON-AST blueprints instantly.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-border bg-card shadow-sm space-y-4 hover:border-cyan-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Custom Domains &amp; Free SSL</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Connect your personal domain (`yourname.dev` or `yourname.com`) with automated SSL certificate provisioning and global edge CDN caching.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-border bg-card shadow-sm space-y-4 hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Realtime Visitor Analytics</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Track pageviews, referral sources, recruiter clicks, and project interest with built-in privacy-focused analytics dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. CALL TO ACTION BANNER */}
      {/* ========================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-12 rounded-3xl bg-gradient-to-r from-violet-900/90 via-slate-900 to-cyan-900/90 border border-violet-500/30 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight relative z-10">
            Ready to Launch Your Personal Website?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto relative z-10">
            Join 50,000+ professionals building stunning portfolios today. No credit card required.
          </p>
          <div className="pt-4 relative z-10">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-2xl shadow-xl hover:scale-105 transition-all"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
