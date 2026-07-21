"use client";

import Link from "next/link";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { Sparkles, Heart, Compass, Users, Target, Award, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const coreValues = [
    {
      icon: Users,
      title: "Developer First",
      description: "Every visual preset, markdown rule, and configuration layout is optimized to display developer achievements clearly.",
    },
    {
      icon: Target,
      title: "Extreme Performance",
      description: "Pre-rendered static sites built without script bloating to ensure sub-second loads and maximum Lighthouse scores.",
    },
    {
      icon: Sparkles,
      title: "AI as a Catalyst",
      description: "We harness Google Gemini to organize bio contents, write credentials summaries, and parse PDF work logs.",
    },
    {
      icon: Award,
      title: "Refined Design System",
      description: "Elegant typography pairings and dynamic glassmorphism components crafted specifically to attract recruiters.",
    },
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
              BuildMyPortfolio was founded to eliminate the weeks spent manually writing CSS and configuring deployment pipelines for personal websites.
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

          {/* Core Values */}
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
