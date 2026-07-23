"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Eye, ArrowRight, Layers, Code, Palette, Briefcase, Zap } from "lucide-react";

export default function TemplatesPage() {
  const [selectedTag, setSelectedTag] = useState("ALL");

  const templates = [
    {
      id: "tpl_1",
      title: "Linear Minimalist",
      category: "DEVELOPER",
      desc: "Sleek dark theme optimized for full-stack engineers with GitHub metrics, tech stack badges, and terminal aesthetics.",
      views: "14.2k",
    },
    {
      id: "tpl_2",
      title: "Framer Portfolio Pro",
      category: "DESIGNER",
      desc: "High-contrast visual layout for UI/UX designers featuring rich image carousels, case study drawers, and smooth motion.",
      views: "18.9k",
    },
    {
      id: "tpl_3",
      title: "Executive Leadership",
      category: "EXECUTIVE",
      desc: "Refined corporate portfolio for VP of Engineering, CTOs, and Product Directors with media quotes and advisor bio.",
      views: "9.5k",
    },
    {
      id: "tpl_4",
      title: "Startup Founder & Pitch",
      category: "STARTUP",
      desc: "Conversion-focused landing portfolio for founders highlighting traction metrics, funding round announcements, and investor pitch decks.",
      views: "11.1k",
    },
  ];

  const filtered = templates.filter(
    (t) => selectedTag === "ALL" || t.category === selectedTag
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pt-32 pb-24 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold">
            <Layers className="w-4 h-4" /> Template Showcase
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
            Handcrafted Templates Built for Performance
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Choose from industry-specific layout designs tuned for SEO speed and modern aesthetics.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold pb-2">
          {["ALL", "DEVELOPER", "DESIGNER", "EXECUTIVE", "STARTUP"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-xl border transition-all ${
                selectedTag === tag
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-card text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((tpl) => (
            <div key={tpl.id} className="p-8 rounded-3xl border border-border bg-card shadow-sm space-y-6 flex flex-col justify-between hover:border-violet-500/40 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-violet-500/10 text-violet-600 border border-violet-500/20">
                    {tpl.category}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">{tpl.views} uses</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">{tpl.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{tpl.desc}</p>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <Link href={`/register?template=${tpl.id}`} className="flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline">
                  Use This Template <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
