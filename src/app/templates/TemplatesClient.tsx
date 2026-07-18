"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Eye, Layout, Monitor, Smartphone, HelpCircle } from "lucide-react";

const templatesList = [
  {
    id: "minimalist",
    name: "Modern Minimalist",
    category: "Developer",
    theme: "Light/Dark Nordic",
    desc: "Spacious layout, subtle thin borders, clean typography priorities, and structural line grid separation.",
    features: ["Sub-second loads", "Excellent text readability", "Clean sidebar layout", "Perfect for Cloud Developers"]
  },
  {
    id: "cyberpunk",
    name: "Neon Cyberpunk",
    category: "Dark",
    theme: "Retro terminal neon",
    desc: "Stark cyber grids, terminal commands input panels, high-contrast borders, and glowing terminal badges.",
    features: ["Glowing badges", "Mono font scaling", "Terminal styled terminal box", "Perfect for Low-Level Devs"]
  },
  {
    id: "startup",
    name: "Startup Tech",
    category: "Startup",
    theme: "Modern linear gradient",
    desc: "Soft card styling, linear gradient boundaries, service capability tables, and sleek profile outlines.",
    features: ["Modern cards", "Capability grids", "Visual timeline maps", "Perfect for SaaS Architects"]
  },
  {
    id: "brutalist",
    name: "Stark Brutalist",
    category: "Creative",
    theme: "Solid raw neo-brutalist",
    desc: "Bold thick typography sizes, solid thick black borders, primary contrast backdrops, and raw layouts.",
    features: ["Loud typography", "Solid black shadows", "Category tabs filters", "Perfect for Creative Designers"]
  },
  {
    id: "creative",
    name: "Creative Portfolio",
    category: "Creative",
    theme: "Playful organic shapes",
    desc: "Liquid shape configurations, organic typography flow, fluid hover transitions, and round card elements.",
    features: ["Liquid shapes", "Organic animations", "Showcase sliders", "Perfect for Brand Designers"]
  },
  {
    id: "luxury",
    name: "Gold Luxury",
    category: "Luxury",
    theme: "Gold accent elegant",
    desc: "Serif font elements, dark luxury slate, amber highlights, thin premium divider lines, and clean blocks.",
    features: ["Elegant serif headings", "Gold accent hues", "Project grid sliders", "Perfect for Advisory Tech Leads"]
  }
];

const categories = ["All", "Developer", "Dark", "Startup", "Creative", "Luxury"];

export default function TemplatesClient() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTemplates = templatesList.filter(
    (t) => selectedCategory === "All" || t.category === selectedCategory
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Header section */}
      <section className="relative overflow-hidden pt-20 pb-12 lg:pt-24 lg:pb-16 border-b border-border/40 bg-secondary/5">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-[9px] uppercase tracking-widest font-extrabold text-primary">Themes Directory</span>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Browse Premium Templates</h1>
          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Choose from a collection of templates crafted specifically for technology professionals, architects, and designers.
          </p>
        </div>
      </section>

      {/* Filter and Content section */}
      <section className="py-12 bg-background flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category Filter Tabs */}
          <div className="flex justify-center gap-2 mb-10 overflow-x-auto pb-2 text-[10px] font-bold uppercase tracking-wider select-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-lg border transition-all cursor-pointer whitespace-nowrap",
                  selectedCategory === cat
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border/60 text-muted-foreground hover:bg-muted"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((temp) => (
                <motion.div
                  key={temp.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="group rounded-2xl border border-border bg-card/30 overflow-hidden flex flex-col justify-between hover:border-primary/40 hover:shadow-lg transition-all duration-300 text-left"
                >
                  <div>
                    {/* Mock Template Drawing (Fidelity Mockup) */}
                    <div className={cn(
                      "aspect-video w-full border-b border-border/80 p-5 flex flex-col justify-between relative overflow-hidden",
                      temp.id === "cyberpunk" ? "bg-zinc-950 text-cyan-400 font-mono" :
                      temp.id === "luxury" ? "bg-zinc-900 text-amber-400 font-serif" :
                      temp.id === "brutalist" ? "bg-yellow-50 text-foreground font-black" :
                      "bg-muted/30 text-foreground"
                    )}>
                      <div className="flex justify-between items-center border-b border-border/60 pb-2">
                        <span className="text-[10px] font-bold">Logo</span>
                        <div className="flex gap-2 text-[8px]">
                          <span>Projects</span>
                          <span>Contact</span>
                        </div>
                      </div>
                      <div className="space-y-1.5 py-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider">{temp.name}</h4>
                        <p className="text-[9px] text-muted-foreground max-w-xs leading-normal line-clamp-2">
                          {temp.desc}
                        </p>
                      </div>
                      <div className="flex justify-between items-center border-t border-border/60 pt-2 text-[8px]">
                        <span>Preset: {temp.theme}</span>
                        <span className="underline">Explore Now</span>
                      </div>
                    </div>

                    {/* Metadata Content */}
                    <div className="p-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                          {temp.category}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{temp.theme}</span>
                      </div>
                      <h3 className="text-base font-bold text-foreground mt-3">{temp.name}</h3>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{temp.desc}</p>

                      <ul className="mt-6 space-y-2">
                        {temp.features.map((feat) => (
                          <li key={feat} className="flex items-center gap-2 text-xs text-foreground">
                            <Sparkles className="h-3 w-3 text-accent shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      href="/register"
                      className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/95 transition-all"
                    >
                      <Eye className="h-4 w-4" />
                      Generate Portfolio
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
