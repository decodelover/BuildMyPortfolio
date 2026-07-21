"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Zap, CheckCircle2, Globe, ShieldCheck, Star, Play, Terminal, Code, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export function WorldClassHero() {
  const [activeRole, setActiveRole] = useState(0);

  const roles = [
    {
      title: "Senior Full-Stack Engineer",
      prompt: "Full-stack architect with 6+ years building Next.js 15, TypeScript, microservices, and Distributed Cloud DAG engines...",
      metrics: "Lighthouse 100/100 • 28 Projects Synced",
    },
    {
      title: "AI & Systems Engineer",
      prompt: "AI Systems Engineer specializing in LLM multi-agent orchestration, Gemini API, PyTorch pipelines, and real-time streaming...",
      metrics: "WCAG AA Passed • 4.9/5 Recruiter Score",
    },
    {
      title: "Lead UI/UX Architect",
      prompt: "Design Systems Architect crafting glassmorphic micro-interactions, Figma design tokens, and high-converting portfolio UX...",
      metrics: "Core Web Vitals 0.6s • SSL Deployed",
    },
  ];

  // Auto-rotate roles every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveRole((prev) => (prev + 1) % roles.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [roles.length]);

  return (
    <section className="relative pt-16 sm:pt-24 pb-20 overflow-hidden text-center select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        {/* Floating Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-extrabold uppercase tracking-wider shadow-sm backdrop-blur-md"
        >
          <Sparkles className="h-4 w-4 text-accent animate-pulse" />
          <span>Next.js 15 + Gemini AI Engine v2.0</span>
        </motion.div>

        {/* Main Headline */}
        <div className="max-w-4xl mx-auto space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.1]"
          >
            Craft Production-Ready <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-accent to-purple-400 bg-clip-text text-transparent">
              Portfolios in Seconds
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium"
          >
            The enterprise AI website builder engineered for software developers, designers, and tech leaders. Auto-generate, compile, and deploy to live global CDNs.
          </motion.p>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-extrabold text-sm shadow-xl shadow-primary/25 hover:opacity-95 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Start Building Free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/showcase"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-border/80 bg-card/80 hover:bg-muted font-bold text-sm text-foreground backdrop-blur-xl transition-all cursor-pointer"
          >
            Explore Showcase <Globe className="h-4 w-4 text-primary" />
          </Link>
        </motion.div>

        {/* Live Streaming AI Generation Terminal Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto pt-6"
        >
          <div className="rounded-3xl border border-border/80 bg-card/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-left space-y-6 hover:border-primary/50 transition-colors relative overflow-hidden">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-muted-foreground font-bold">
                  gemini-orchestrator-v2.0
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Pipeline Operational
              </span>
            </div>

            {/* Role Switcher Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {roles.map((r, idx) => (
                <button
                  key={r.title}
                  type="button"
                  onClick={() => setActiveRole(idx)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                    activeRole === idx
                      ? "bg-primary text-primary-foreground shadow-xs scale-105"
                      : "bg-muted/40 text-muted-foreground hover:text-foreground border border-border/50"
                  )}
                >
                  {r.title}
                </button>
              ))}
            </div>

            {/* Active Role Content Box */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRole}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="rounded-2xl border border-border/60 bg-background/80 p-4 font-mono text-xs text-foreground space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Terminal className="h-4 w-4" /> User Prompt Input:
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-6">"{roles[activeRole].prompt}"</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-muted-foreground pt-1">
                  <div className="flex items-center gap-2 text-emerald-500">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{roles[activeRole].metrics}</span>
                  </div>
                  <Link
                    href="/register"
                    className="text-primary font-bold hover:underline flex items-center gap-1"
                  >
                    Test Live Generation <Zap className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Feature Badges */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
            <span>99.9% Live CDN Uptime SLA</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="h-4.5 w-4.5 text-primary" />
            <span>Google Gemini AI Architecture</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4.5 w-4.5 text-amber-500 fill-amber-500" />
            <span>Rated 4.9/5 by 28,000+ Creators</span>
          </div>
        </div>
      </div>
    </section>
  );
}
