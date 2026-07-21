"use client";

import Link from "next/link";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { motion } from "framer-motion";
import {
  Sparkles,
  Heart,
  Compass,
  Users,
  Target,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Code,
  Zap,
} from "lucide-react";

export default function AboutPage() {
  const coreValues = [
    {
      icon: Users,
      title: "Developer First",
      description: "Every visual preset, markdown rule, and layout is crafted specifically to highlight technical achievements.",
    },
    {
      icon: Target,
      title: "Sub-Second Performance",
      description: "Pre-rendered static sites compiled on global edge CDNs for maximum Core Web Vitals and Lighthouse scores.",
    },
    {
      icon: Sparkles,
      title: "AI as an Architect",
      description: "Harnessing Google Gemini to summarize complex projects, generate copy, and structure technical achievements.",
    },
    {
      icon: Award,
      title: "Refined Craftsmanship",
      description: "Bespoke glassmorphic components, fluid motion physics, and accessible typography systems.",
    },
  ];

  const milestones = [
    { year: "2024", title: "Project Inception", desc: "BuildMyPortfolio was created by senior engineers frustrated by weekend CSS config overhead." },
    { year: "2025", title: "Gemini AI Engine v1", desc: "Launched automated portfolio generation engine and GitHub repository syncing." },
    { year: "2026", title: "Global CDN & Theme Engine", desc: "Over 28,000 developer portfolios deployed across 140+ countries." },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 text-left">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-wider">
              About BuildMyPortfolio
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
              Empowering Developers to Showcase Their Craft
            </h1>
            <p className="text-xs sm:text-base text-muted-foreground font-medium leading-relaxed">
              BuildMyPortfolio was founded to eliminate weeks of manual styling and pipeline configuration when launching developer websites.
            </p>
          </div>

          {/* Mission & Vision Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="rounded-3xl border border-border/60 bg-card/70 p-8 shadow-sm backdrop-blur-2xl space-y-4">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-extrabold text-foreground">Our Mission</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                To simplify the professional presence of software engineers by combining automated imports, curated themes, and AI copywriting.
              </p>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card/70 p-8 shadow-sm backdrop-blur-2xl space-y-4">
              <div className="h-10 w-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center font-bold">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-extrabold text-foreground">Our Vision</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                To build the universal standard for technical digital profiles, enabling recruiters to discover candidate achievements in seconds.
              </p>
            </div>
          </div>

          {/* Product Principles */}
          <div className="space-y-8 max-w-5xl mx-auto text-center">
            <h2 className="text-2xl font-extrabold text-foreground">Our Engineering Principles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              {coreValues.map((v, idx) => {
                const Icon = v.icon;
                return (
                  <div key={idx} className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <h4 className="text-sm font-extrabold text-foreground">{v.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">{v.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Milestones Timeline */}
          <div className="max-w-4xl mx-auto space-y-6 text-center">
            <h2 className="text-2xl font-extrabold text-foreground">Company Growth Timeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {milestones.map((m, idx) => (
                <div key={idx} className="rounded-3xl border border-border/60 bg-card/70 p-6 space-y-2">
                  <span className="text-xs font-mono font-extrabold text-primary">{m.year}</span>
                  <h4 className="text-sm font-extrabold text-foreground">{m.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
