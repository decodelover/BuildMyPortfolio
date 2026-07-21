"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, CheckCircle2, Play, Globe, ShieldCheck, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const [activePrompt, setActivePrompt] = useState(
    "Senior Full-Stack Engineer with 5+ years of React, Next.js 15, and Cloud microservices experience..."
  );
  const [selectedRole, setSelectedRole] = useState("Developer");

  const roles = [
    { label: "Software Developer", prompt: "Senior Full-Stack Engineer with 5+ years of React, Next.js 15, and Cloud microservices experience..." },
    { label: "AI & ML Engineer", prompt: "AI Systems Engineer specializing in LLMs, Gemini API, PyTorch, and distributed multi-agent workflows..." },
    { label: "UX / UI Designer", prompt: "Principal Product Designer crafting sleek glassmorphism design systems, Figma prototypes, and micro-interactions..." },
    { label: "DevOps & Cloud Engineer", prompt: "DevOps Architect specializing in Kubernetes, Terraform, AWS, Docker containers, and CI/CD pipelines..." },
  ];

  return (
    <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden text-center select-none">
      {/* Glow Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-primary/20 via-accent/15 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-extrabold uppercase tracking-wider shadow-sm backdrop-blur-md"
        >
          <Sparkles className="h-4 w-4 text-accent animate-pulse" />
          <span>Next.js 15 + Gemini AI Engine v2.0</span>
        </motion.div>

        {/* Main Heading */}
        <div className="max-w-4xl mx-auto space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.1]"
          >
            Build Production-Ready <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-accent to-purple-400 bg-clip-text text-transparent">
              Portfolios in Seconds
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium"
          >
            The enterprise AI website builder engineered for developers, designers, and tech leaders. Auto-generate, compile, and deploy to live global CDNs.
          </motion.p>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-extrabold text-sm shadow-xl shadow-primary/25 hover:opacity-95 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Start Building Free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/showcase"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl border border-border/80 bg-card/80 hover:bg-muted font-bold text-sm text-foreground backdrop-blur-xl transition-all cursor-pointer"
          >
            Explore Showcase <Globe className="h-4 w-4 text-primary" />
          </Link>
        </motion.div>

        {/* Interactive Prompt Simulator Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="max-w-3xl mx-auto pt-6"
        >
          <div className="rounded-3xl border border-border/80 bg-card/90 p-4 sm:p-5 shadow-2xl backdrop-blur-2xl text-left space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <span className="text-xs font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Interactive AI Prompt Simulator
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-accent/20 text-accent uppercase tracking-wider">
                Instant Generation
              </span>
            </div>

            {/* Role Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {roles.map((r) => (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => {
                    setSelectedRole(r.label);
                    setActivePrompt(r.prompt);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer",
                    selectedRole === r.label
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/40 border border-border/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Simulated Prompt Box */}
            <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/80 p-3 shadow-inner">
              <textarea
                value={activePrompt}
                onChange={(e) => setActivePrompt(e.target.value)}
                rows={2}
                className="w-full bg-transparent text-xs font-medium text-foreground focus:outline-none resize-none leading-relaxed"
              />
              <Link
                href="/register"
                className="h-10 px-4 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-xs flex items-center gap-1.5 shrink-0 hover:opacity-90 transition-opacity cursor-pointer shadow-md"
              >
                Generate <Zap className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Feature Badges */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
            <span>99.9% Live CDN Uptime SLA</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4.5 w-4.5 text-primary" />
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
