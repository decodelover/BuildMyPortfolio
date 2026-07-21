"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sparkles, Globe, ArrowRight, Eye, ExternalLink } from "lucide-react";

const showcaseList = [
  {
    id: "alex-rivera",
    name: "Alex Rivera",
    role: "Full-Stack Engineer",
    theme: "Minimalist Slate",
    category: "Full-Stack",
    desc: "A Nordic Minimalist style portfolio featuring project grid cards and live API integrations.",
    domain: "alex-rivera.buildmyportfolio.com",
    skills: ["Next.js", "Zustand", "Node.js", "PostgreSQL"],
  },
  {
    id: "marcus-vance",
    name: "Marcus Vance",
    role: "Principal Cloud DevOps Architect",
    theme: "Startup Tech",
    category: "DevOps",
    desc: "Startup layout detailing Kubernetes clusters, terraform configs, and CI/CD pipelines.",
    domain: "marcus-devops.buildmyportfolio.com",
    skills: ["AWS", "Kubernetes", "Terraform", "Docker"],
  },
  {
    id: "sarah-jenkins",
    name: "Sarah Jenkins",
    role: "Systems Architect & Go Developer",
    theme: "Neon Cyberpunk",
    category: "Backend",
    desc: "Terminal console style portfolio featuring glowing border highlights and GitHub repository stars.",
    domain: "jenkins-go.buildmyportfolio.com",
    skills: ["Go", "Rust", "gRPC", "WebAssembly"],
  },
  {
    id: "elena-rostova",
    name: "Elena Rostova",
    role: "Lead UI/UX Architect",
    theme: "Creative Aurora",
    category: "UI/UX",
    desc: "Fluid organic shape details, dynamic text scaling, and glassmorphic micro-interactions.",
    domain: "elena-design.buildmyportfolio.com",
    skills: ["Figma", "Design Systems", "Webflow", "Tailwind"],
  },
];

const categories = ["All", "Full-Stack", "DevOps", "Backend", "UI/UX"];

export default function ShowcaseClient() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredShowcase = showcaseList.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 text-left">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-wider">
              Live Showcase Gallery
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
              Featured Live Developer Websites
            </h1>
            <p className="text-xs sm:text-base text-muted-foreground font-medium leading-relaxed">
              Explore live portfolios built and deployed by technology leaders, engineers, and designers.
            </p>
          </div>

          {/* Category Filter Bar */}
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

          {/* Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredShowcase.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-4 hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                      {item.theme}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">{item.domain}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-foreground">{item.name}</h3>
                    <p className="text-xs text-primary font-bold">{item.role}</p>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-medium">{item.desc}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {item.skills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-muted text-[9px] font-semibold text-muted-foreground">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-emerald-500 flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5" /> Live CDN Site
                  </span>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:opacity-90 transition-opacity"
                  >
                    Build Similar Site <ArrowRight className="h-3.5 w-3.5" />
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
