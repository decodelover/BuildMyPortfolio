"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Smartphone, Sparkles, Check, ArrowRight, Eye, Code, Layers } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function InteractivePlayground() {
  const [activeTheme, setActiveTheme] = useState<"minimalist" | "cyberpunk" | "brutalist" | "creative">("cyberpunk");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const themes = [
    { id: "cyberpunk", name: "Cyberpunk Obsidian", bg: "bg-zinc-950 text-cyan-400 border-cyan-500/30" },
    { id: "brutalist", name: "Brutalist Neon", bg: "bg-yellow-100 text-black border-black dark:bg-yellow-950/40 dark:text-yellow-200" },
    { id: "creative", name: "Creative Aurora", bg: "bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 text-purple-200 border-purple-500/30" },
    { id: "minimalist", name: "Minimalist Slate", bg: "bg-slate-900 text-slate-100 border-slate-700" },
  ] as const;

  return (
    <section className="py-16 sm:py-24 bg-card/40 border-y border-border/40 relative overflow-hidden text-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-extrabold uppercase tracking-wider">
            Live Interactive Playground
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Test Themes &amp; Live Rendered Layouts
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            Switch between high-contrast theme systems instantly. No sign-up required to test.
          </p>
        </div>

        {/* Theme & Device Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 max-w-5xl mx-auto">
          {/* Theme Selector */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {themes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTheme(t.id)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                  activeTheme === t.id
                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                    : "bg-card border border-border/60 text-muted-foreground hover:text-foreground"
                )}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Device Selector */}
          <div className="flex items-center p-1 rounded-xl bg-card border border-border/60 text-xs font-bold">
            <button
              type="button"
              onClick={() => setDevice("desktop")}
              className={cn(
                "px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer",
                device === "desktop" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              <Monitor className="h-3.5 w-3.5" /> Desktop
            </button>
            <button
              type="button"
              onClick={() => setDevice("mobile")}
              className={cn(
                "px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer",
                device === "mobile" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              <Smartphone className="h-3.5 w-3.5" /> Mobile
            </button>
          </div>
        </div>

        {/* Live Preview Frame Container */}
        <div className="max-w-5xl mx-auto flex justify-center">
          <div
            className={cn(
              "rounded-3xl border shadow-2xl p-6 sm:p-8 transition-all duration-300 text-left space-y-6 overflow-hidden",
              themes.find((t) => t.id === activeTheme)?.bg,
              device === "desktop" ? "w-full" : "w-[380px]"
            )}
          >
            {/* Mock Header */}
            <div className="flex items-center justify-between border-b border-current/20 pb-4">
              <div className="font-black text-base flex items-center gap-2">
                <Sparkles className="h-5 w-5" /> Alex Carter
              </div>
              <div className="text-xs font-mono opacity-80">alexcarter.dev</div>
            </div>

            {/* Mock Hero Content */}
            <div className="space-y-3 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono border border-current/30 uppercase tracking-wider">
                Senior AI Systems Engineer
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Architecting Enterprise AI Agents &amp; Cloud Systems.
              </h3>
              <p className="text-xs opacity-80 max-w-xl leading-relaxed">
                Specializing in distributed LLM orchestration, Next.js 15, and real-time streaming architectures.
              </p>
            </div>

            {/* Mock Projects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl border border-current/20 bg-current/5 space-y-2">
                <span className="text-[9px] font-mono uppercase tracking-wider opacity-70">Project 01</span>
                <h4 className="text-xs font-bold">OrchestrationEngine v2</h4>
                <p className="text-[11px] opacity-80">DAG topological execution planner for multi-agent workflows.</p>
              </div>
              <div className="p-4 rounded-2xl border border-current/20 bg-current/5 space-y-2">
                <span className="text-[9px] font-mono uppercase tracking-wider opacity-70">Project 02</span>
                <h4 className="text-xs font-bold">PortfolioCompiler</h4>
                <p className="text-[11px] opacity-80">High-speed Theme &amp; Asset compilation engine.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-xs shadow-lg hover:opacity-90 transition-opacity"
          >
            Build Portfolio With This Theme <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
