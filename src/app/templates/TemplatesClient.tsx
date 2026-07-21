"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { cn } from "@/lib/utils";
import { Sparkles, ArrowRight, CheckCircle2, LayoutGrid } from "lucide-react";

const templatesList = [
  {
    id: "minimalist",
    name: "Modern Minimalist",
    category: "Developer",
    theme: "Light/Dark Nordic",
    desc: "Spacious layout, subtle thin borders, clean typography priorities, and structural line grid separation.",
    features: ["Sub-second loads", "Excellent text readability", "Clean sidebar layout", "Perfect for Cloud Developers"],
  },
  {
    id: "cyberpunk",
    name: "Neon Cyberpunk",
    category: "Dark",
    theme: "Retro terminal neon",
    desc: "Stark cyber grids, terminal command input panels, high-contrast borders, and glowing terminal badges.",
    features: ["Glowing badges", "Mono font scaling", "Terminal styled box", "Perfect for Systems Devs"],
  },
  {
    id: "startup",
    name: "Startup Tech",
    category: "Startup",
    theme: "Modern linear gradient",
    desc: "Soft card styling, linear gradient boundaries, service capability tables, and sleek profile outlines.",
    features: ["Modern cards", "Capability grids", "Visual timeline maps", "Perfect for SaaS Architects"],
  },
  {
    id: "brutalist",
    name: "Stark Brutalist",
    category: "Creative",
    theme: "Solid raw neo-brutalist",
    desc: "Bold thick typography sizes, solid thick black borders, primary contrast backdrops, and raw layouts.",
    features: ["Loud typography", "Solid black shadows", "Category tabs filters", "Perfect for Creative Designers"],
  },
];

const categories = ["All", "Developer", "Dark", "Startup", "Creative"];

export default function TemplatesClient() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTemplates = templatesList.filter(
    (t) => selectedCategory === "All" || t.category === selectedCategory
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 text-left">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-wider">
              Template Marketplace
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
              Curated High-Converting Themes
            </h1>
            <p className="text-xs sm:text-base text-muted-foreground font-medium leading-relaxed">
              Every theme is responsive, WCAG AA accessible, and optimized for sub-second page loads.
            </p>
          </div>

          {/* Categories */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card border border-border/60 text-muted-foreground hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredTemplates.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-4 hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
                      {item.theme}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-bold">{item.category}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-foreground">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed font-medium">{item.desc}</p>
                  </div>

                  <ul className="space-y-1.5 text-xs text-muted-foreground font-medium border-t border-border/40 pt-3">
                    {item.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-border/40">
                  <Link
                    href="/register"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:opacity-90 transition-opacity"
                  >
                    Use Template Free <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
