"use client";

import Link from "next/link";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { motion } from "framer-motion";
import { Heart, Compass, Users, Award, ShieldAlert, Sparkles, ArrowRight, Zap, Target } from "lucide-react";

const coreValues = [
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: "Developer First",
    description: "Every visual preset, syntax rule, and builder configuration is created to highlight developer achievements in a clean, legible format.",
  },
  {
    icon: <Target className="h-6 w-6 text-accent" />,
    title: "Extreme Performance",
    description: "Zero bloated assets. Our compiled portfolio pages load in milliseconds, optimizing rendering speeds and score results.",
  },
  {
    icon: <Sparkles className="h-6 w-6 text-primary" />,
    title: "AI as a Catalyst",
    description: "We utilize natural language AI models like Gemini to edit profiles, refine project copy, and draft bios, but leave structural layout styling to standard presets.",
  },
  {
    icon: <Award className="h-6 w-6 text-accent" />,
    title: "Uncompromising Design",
    description: "We build responsive themes using refined, curated typography and animations that immediately attract engineering recruiters.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Hero section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-24 lg:pb-20 border-b border-border bg-gradient-to-b from-background to-secondary/10">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-12 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-24 right-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary"
          >
            <Compass className="h-4 w-4 text-accent animate-pulse" />
            Our Story &amp; Vision
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground"
          >
            Empowering Developers to
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Showcase Their True Potential.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            BuildMyPortfolio was founded by a team of software engineers who realized that building a personal website shouldn&apos;t take weeks of manual configuration away from coding real projects.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-4 text-left p-6 rounded-2xl border border-border bg-card/45"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Heart className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                To simplify the professional presence of software engineers by combining automated imports (GitHub, LinkedIn), visual custom presets, and AI content editing. We help developers secure interviews, land contracts, and display their accomplishments with pride.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-4 text-left p-6 rounded-2xl border border-border bg-card/45"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Compass className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Our Vision</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                We envision a world where developer recruitment is driven by live, responsive projects and verified capabilities rather than static text files. BuildMyPortfolio aims to be the universal standard for technical digital profiles.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story timeline */}
      <section className="py-20 border-t border-border bg-secondary/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight">The BuildMyPortfolio Story</h2>
            <p className="text-sm text-muted-foreground mt-2">How we went from an open-source tool to a global SaaS platform.</p>
          </div>

          <div className="space-y-12 relative before:absolute before:inset-y-0 before:left-4 md:before:left-1/2 before:w-0.5 before:bg-border">
            {/* Step 1 */}
            <div className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center">
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-xs font-bold ring-4 ring-background">
                2024
              </div>
              <div className="ml-12 md:ml-0 md:w-[45%] text-left p-6 rounded-xl border border-border bg-background shadow-md">
                <h4 className="font-bold text-foreground">The Spark</h4>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  We built a simple command-line parser that scraped public GitHub repositories and compiled them into static Markdown files. It became popular on Reddit and developer boards.
                </p>
              </div>
              <div className="hidden md:block w-[45%]" />
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center">
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white text-xs font-bold ring-4 ring-background">
                2202
              </div>
              <div className="hidden md:block w-[45%]" />
              <div className="ml-12 md:ml-0 md:w-[45%] text-left p-6 rounded-xl border border-border bg-background shadow-md">
                <h4 className="font-bold text-foreground">AI Integration</h4>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
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
                <h4 className="font-bold text-foreground">Global SaaS Launch</h4>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Launched BuildMyPortfolio as a full-stack Next.js 15 Web application. Providing instant template customization, secure subdomains, and one-time payment options for thousands of engineers worldwide.
                </p>
              </div>
              <div className="hidden md:block w-[45%]" />
            </div>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="py-20 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight">Our Core Values</h2>
            <p className="text-sm text-muted-foreground mt-2">The principles that guide our product and team decisions every single day.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((val) => (
              <div key={val.title} className="p-6 rounded-2xl border border-border bg-card/45 hover:border-primary/40 transition-colors text-left space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  {val.icon}
                </div>
                <h4 className="font-bold text-foreground">{val.title}</h4>
                <p className="text-xs leading-relaxed text-muted-foreground">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 text-center relative overflow-hidden bg-secondary">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Create your account today
          </h2>
          <p className="mx-auto max-w-xl text-slate-300 text-sm sm:text-base leading-relaxed">
            Get your developer credentials online with a clean layout and hosting setup in less than 5 minutes.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-primary/95 transition-all duration-200"
            >
              Start Generating Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/features"
              className="rounded-xl border border-slate-700 bg-slate-900/60 text-white hover:bg-slate-900 px-8 py-3.5 text-base font-semibold transition-all duration-200"
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
