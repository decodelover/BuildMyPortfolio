"use client";

import Link from "next/link";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { motion } from "framer-motion";
import { Heart, Compass, Users, Award, Sparkles, ArrowRight, Target } from "lucide-react";

const coreValues = [
  {
    icon: <Users className="h-5 w-5 text-primary" />,
    title: "Developer First",
    description: "Every visual preset, markdown rule, and configuration layout is optimized to display developer achievements clearly.",
  },
  {
    icon: <Target className="h-5 w-5 text-accent" />,
    title: "Extreme Performance",
    description: "Pre-rendered static sites built without script bloating to ensure sub-second loads and maximum Lighthouse scores.",
  },
  {
    icon: <Sparkles className="h-5 w-5 text-primary" />,
    title: "AI as a Catalyst",
    description: "We harness Google Gemini to organize bio contents, write credentials summaries, and parse PDF work logs.",
  },
  {
    icon: <Award className="h-5 w-5 text-accent" />,
    title: "Refined Design System",
    description: "Elegant typography pairings and dynamic glassmorphism components crafted specifically to attract recruiters.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Hero section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-24 lg:pb-20 border-b border-border/40 bg-secondary/5">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute top-12 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl opacity-60" />
        <div className="absolute top-24 right-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl opacity-60" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[9px] uppercase tracking-wider font-extrabold text-primary"
          >
            <Compass className="h-3.5 w-3.5 text-accent animate-pulse" />
            Our Story &amp; Vision
          </motion.div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl leading-tight">
            Empowering Developers to Showcase{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Their Achievements.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
            BuildMyPortfolio was founded by software engineers who wanted a faster, cleaner solution to launch developer websites without weeks of manual styling.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-background border-b border-border/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4 text-left p-6 rounded-2xl border border-border bg-card/45"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Heart className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Our Mission</h2>
              <p className="text-xs leading-relaxed text-muted-foreground">
                To simplify the professional presence of software engineers by combining automated imports (GitHub, LinkedIn), visual custom presets, and AI content editing. We help developers secure interviews, land contracts, and display their accomplishments with pride.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4 text-left p-6 rounded-2xl border border-border bg-card/45"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Compass className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Our Vision</h2>
              <p className="text-xs leading-relaxed text-muted-foreground">
                We envision a world where developer recruitment is driven by live, responsive projects and verified capabilities rather than static text files. BuildMyPortfolio aims to be the universal standard for technical digital profiles.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story timeline */}
      <section className="py-20 bg-secondary/5 border-b border-border/40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-black tracking-tight">The BuildMyPortfolio Story</h2>
            <p className="text-xs text-muted-foreground mt-2">How we went from an open-source parser utility to a premium developer SaaS platform.</p>
          </div>

          <div className="space-y-12 relative before:absolute before:inset-y-0 before:left-4 md:before:left-1/2 before:w-0.5 before:bg-border">
            {/* Step 1 */}
            <div className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center">
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-xs font-bold ring-4 ring-background">
                2024
              </div>
              <div className="ml-12 md:ml-0 md:w-[45%] text-left p-6 rounded-xl border border-border bg-background shadow-md">
                <h4 className="text-xs font-bold text-foreground">The Spark</h4>
                <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                  We built a simple command-line parser that scraped public GitHub repositories and compiled them into static Markdown files. It became popular on Reddit and developer boards.
                </p>
              </div>
              <div className="hidden md:block w-[45%]" />
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center">
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white text-xs font-bold ring-4 ring-background">
                2025
              </div>
              <div className="hidden md:block w-[45%]" />
              <div className="ml-12 md:ml-0 md:w-[45%] text-left p-6 rounded-xl border border-border bg-background shadow-md">
                <h4 className="text-xs font-bold text-foreground">AI Integration</h4>
                <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                  We connected our parser to Google Gemini models to assist developers in refining their project writeups. User engagement increased, highlighting the need for visual dashboard editors.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center">
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-xs font-bold ring-4 ring-background">
                2026
              </div>
              <div className="ml-12 md:ml-0 md:w-[45%] text-left p-6 rounded-xl border border-border bg-background shadow-md">
                <h4 className="text-xs font-bold text-foreground">Global SaaS Launch</h4>
                <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                  Launched BuildMyPortfolio as a full-stack Next.js Web application. Providing instant template customization, secure subdomains, and one-time payment options for thousands of engineers worldwide.
                </p>
              </div>
              <div className="hidden md:block w-[45%]" />
            </div>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="py-20 bg-background border-b border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl font-black tracking-tight">Our Core Values</h2>
            <p className="text-xs text-muted-foreground mt-2">The principles that guide our product development decisions every single day.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((val) => (
              <div key={val.title} className="p-6 rounded-2xl border border-border bg-card/45 hover:border-primary/40 transition-colors text-left space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                  {val.icon}
                </div>
                <h4 className="text-xs font-bold text-foreground">{val.title}</h4>
                <p className="text-[11px] leading-relaxed text-muted-foreground">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 text-center relative overflow-hidden bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] opacity-80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-primary/10 blur-3xl opacity-60" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative space-y-6">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-white">
            Create your account today
          </h2>
          <p className="mx-auto max-w-xl text-zinc-400 text-xs sm:text-sm leading-relaxed">
            Get your developer credentials online with a clean layout and hosting setup in less than 5 minutes.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-primary/95 transition-all duration-200"
            >
              Start Generating Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/features"
              className="rounded-xl border border-slate-800 bg-slate-900/60 text-white hover:bg-slate-900 px-7 py-3.5 text-xs font-bold transition-all duration-200"
            >
              Learn More About Features
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
