"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Monitor, Smartphone, Globe, ArrowRight, Eye } from "lucide-react";

const showcaseList = [
  {
    id: "alex-rivera",
    name: "Alex Rivera",
    role: "Full-Stack Engineer",
    theme: "Minimalist",
    category: "Full-Stack",
    desc: "A Nordic Minimalist style portfolio page with thin grey border divisions, project grid cards, and inline links.",
    domain: "alex-rivera.buildmyportfolio.com",
    skills: ["Next.js", "Zustand", "Node.js", "PostgreSQL"],
    bgClass: "bg-slate-50 dark:bg-slate-900/60"
  },
  {
    id: "marcus-vance",
    name: "Marcus Vance",
    role: "Principal Cloud DevOps",
    theme: "Startup Tech",
    category: "DevOps",
    desc: "Startup style landing layout showing capabilities list columns, vertical timeline experience, and database sync setups.",
    domain: "marcus-devops.buildmyportfolio.com",
    skills: ["AWS", "Kubernetes", "Terraform", "Docker"],
    bgClass: "bg-background/80"
  },
  {
    id: "sarah-jenkins",
    name: "Sarah Jenkins",
    role: "Systems Architect & Go Developer",
    theme: "Neon Cyberpunk",
    category: "Backend",
    desc: "A terminal console neon style portfolio page featuring glowing border highlights, code inputs, and synced repo stars.",
    domain: "jenkins-go.buildmyportfolio.com",
    skills: ["Go", "Rust", "gRPC", "WebAssembly"],
    bgClass: "bg-zinc-950 text-cyan-400"
  },
  {
    id: "elena-rostova",
    name: "Elena Rostova",
    role: "Lead UI/UX Architect",
    theme: "Creative Portfolio",
    category: "UI/UX",
    desc: "Organic fluid shape details, playful text size scales, and responsive portfolio sliders designed to look gorgeous.",
    domain: "elena-design.buildmyportfolio.com",
    skills: ["Figma", "Design Systems", "Webflow", "Tailwind"],
    bgClass: "bg-amber-50/40 dark:bg-zinc-900"
  }
];

const categories = ["All", "Full-Stack", "DevOps", "Backend", "UI/UX"];

export default function ShowcaseClient() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredShowcase = showcaseList.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Header section */}
      <section className="relative overflow-hidden pt-20 pb-12 lg:pt-24 lg:pb-16 border-b border-border/40 bg-secondary/5">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-[9px] uppercase tracking-widest font-extrabold text-primary">Live Showcase</span>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Featured Developer Websites</h1>
          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
            See how developers are using BuildMyPortfolio to showcase their projects, sync credentials automatically, and land engineering roles.
          </p>
        </div>
      </section>

      {/* Content section */}
      <section className="py-12 bg-background flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category Tabs Filter */}
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

          {/* Showcase Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <AnimatePresence mode="popLayout">
              {filteredShowcase.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col bg-card/20 rounded-2xl border border-border p-6 hover:border-primary/30 transition-all text-left group"
                >
                  {/* Side-by-Side Desktop & Mobile Mockups */}
                  <div className="relative aspect-video w-full rounded-xl bg-muted/40 border border-border/80 p-4 flex gap-4 overflow-hidden mb-6 select-none shadow-sm">
                    {/* Desktop Mockup */}
                    <div className={cn(
                      "flex-1 rounded-lg border border-border bg-background p-3 flex flex-col justify-between shadow-md",
                      item.bgClass
                    )}>
                      <div className="flex justify-between items-center border-b border-border/40 pb-1.5 text-[7px] font-bold">
                        <span>{item.name}</span>
                        <div className="flex gap-1.5 text-[6px]">
                          <span>Work</span>
                          <span>Contact</span>
                        </div>
                      </div>
                      <div className="space-y-1 my-2">
                        <h4 className="text-[9px] font-extrabold uppercase">{item.role}</h4>
                        <p className="text-[7px] text-muted-foreground leading-normal line-clamp-2">
                          {item.desc}
                        </p>
                      </div>
                      <div className="border-t border-border/40 pt-1 flex justify-between items-center text-[6px] text-muted-foreground">
                        <span>{item.domain}</span>
                        <span className="font-bold underline text-primary">View Portfolio</span>
                      </div>
                    </div>

                    {/* Mobile Mockup overlapping slightly */}
                    <div className={cn(
                      "w-[60px] rounded-lg border border-border bg-background p-2 flex flex-col justify-between shadow-lg shrink-0",
                      item.bgClass
                    )}>
                      <div className="flex justify-between items-center border-b border-border/40 pb-1 text-[5px] font-bold">
                        <span>{item.name[0]}</span>
                        <span>Menu</span>
                      </div>
                      <div className="text-[5px] my-2 text-muted-foreground leading-tight text-center">
                        <span className="font-extrabold block text-foreground mb-0.5">{item.name.split(" ")[0]}</span>
                        {item.role.split(" ")[0]}
                      </div>
                      <div className="border-t border-border/40 pt-1 text-[5px] text-center text-primary font-bold">
                        Link
                      </div>
                    </div>
                  </div>

                  {/* Metadata and Link */}
                  <div className="space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-muted-foreground">Theme: {item.theme}</span>
                      </div>
                      <h3 className="text-base font-bold text-foreground mt-3">{item.name}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">{item.desc}</p>

                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded bg-muted px-2 py-0.5 text-[9px] font-bold border border-border/50 text-muted-foreground"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border/40 flex items-center justify-between text-xs">
                      <span className="font-mono text-muted-foreground text-[10px]">{item.domain}</span>
                      <Link
                        href="/register"
                        className="flex items-center gap-1 font-bold text-primary hover:underline"
                      >
                        Explore This Style
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
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
