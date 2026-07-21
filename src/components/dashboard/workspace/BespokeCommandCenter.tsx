"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Sparkles,
  Plus,
  ArrowRight,
  Globe,
  Clock,
  Zap,
  ShieldCheck,
  Award,
  Eye,
  CheckCircle2,
  Bookmark,
  TrendingUp,
  Activity,
  BarChart2,
  FileCode,
  Layers,
} from "lucide-react";
import { PortfolioPreviewModal } from "@/components/dashboard/ui/PortfolioPreviewModal";
import { cn } from "@/lib/utils";

export function BespokeCommandCenter() {
  const { user } = useAuthStore();
  const [previewPortfolio, setPreviewPortfolio] = useState<{
    id: string;
    title: string;
    domain?: string;
  } | null>(null);

  const portfolios = [
    {
      id: "demo-1",
      title: "Senior Full-Stack Architecture Portfolio",
      status: "Published",
      theme: "Cyberpunk Obsidian",
      updatedAt: "10 mins ago",
      domain: "alex-rivera.buildmyportfolio.com",
      views: 1240,
      seoScore: 99,
    },
    {
      id: "demo-2",
      title: "Cloud Systems & DevOps Engineering",
      status: "Draft",
      theme: "Minimalist Slate",
      updatedAt: "2 hours ago",
      domain: "devops-master.buildmyportfolio.com",
      views: 450,
      seoScore: 94,
    },
  ];

  return (
    <div className="space-y-8 text-left select-none">
      {/* Welcome & Continue Working Banner */}
      <div className="rounded-3xl border border-border/60 bg-gradient-to-r from-card via-card to-primary/10 p-6 sm:p-8 shadow-sm backdrop-blur-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
            AI Workspace Command Center
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
            Welcome back, {user?.fullName || "Developer"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
            Your personal portfolio is currently <span className="text-emerald-500 font-extrabold">99.9% Live</span> on global CDN edge nodes.
          </p>
        </div>

        {/* Continue Working Trigger */}
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <Link
            href="/dashboard/create"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-extrabold text-xs shadow-md hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
          >
            Continue Building <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Metrics Radar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">Active Portfolios</span>
            <Globe className="h-4.5 w-4.5 text-primary" />
          </div>
          <p className="text-3xl font-black text-foreground">2</p>
          <span className="text-[10px] text-emerald-500 font-extrabold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> All Systems Online
          </span>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">AI Health Score</span>
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-foreground">99 / 100</p>
          <span className="text-[10px] text-muted-foreground font-medium">WCAG AA &amp; Core Web Vitals Passed</span>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">Monthly AI Credits</span>
            <Zap className="h-4.5 w-4.5 text-accent" />
          </div>
          <p className="text-3xl font-black text-foreground">2,450 / 2,500</p>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full w-[95%]" />
          </div>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">Monthly Visitors</span>
            <TrendingUp className="h-4.5 w-4.5 text-purple-400" />
          </div>
          <p className="text-3xl font-black text-foreground">1,690</p>
          <span className="text-[10px] text-emerald-500 font-extrabold">+24% vs last week</span>
        </div>
      </div>

      {/* Portfolios Timeline Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
            <FileCode className="h-5 w-5 text-primary" /> Active Workspace Projects
          </h2>
          <Link
            href="/dashboard/portfolios"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            View All Portfolios <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolios.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-4 hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider",
                      item.status === "Published"
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    )}
                  >
                    {item.status}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">{item.updatedAt}</span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">{item.domain}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPreviewPortfolio({ id: item.id, title: item.title, domain: item.domain })}
                  className="px-3.5 py-1.5 rounded-xl border border-border/60 hover:bg-muted text-xs font-bold text-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-primary" /> Preview Sandbox
                </button>

                <Link
                  href="/dashboard/create"
                  className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:opacity-90 transition-opacity"
                >
                  Edit in Wizard
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {previewPortfolio && (
        <PortfolioPreviewModal
          isOpen={!!previewPortfolio}
          onClose={() => setPreviewPortfolio(null)}
          portfolioId={previewPortfolio.id}
          portfolioTitle={previewPortfolio.title}
        />
      )}
    </div>
  );
}
