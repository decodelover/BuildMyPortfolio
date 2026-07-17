"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Zap,
  Globe,
  Layout,
  Code,
  Shield,
  ArrowRight,
  Check,
  ChevronDown,
  Monitor,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: <Sparkles className="h-6 w-6 text-accent" />,
    title: "AI-Powered Generation",
    description:
      "Our Gemini-backed engine writes professional summaries, layouts, and projects from a simple text prompt or resume upload.",
  },
  {
    icon: <Layout className="h-6 w-6 text-primary" />,
    title: "Beautiful Responsive Themes",
    description:
      "Dozens of premium, customizable developer templates tailored to designers, backend, frontend, and full-stack engineers.",
  },
  {
    icon: <Globe className="h-6 w-6 text-accent" />,
    title: "Instant One-Click Deployment",
    description:
      "Deploy your generated portfolio to a custom subdomain or attach your own custom domain name securely with SSL.",
  },
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: "TanStack & Zustand Speed",
    description:
      "Blazing fast editor interface with reactive state storage and instant save features. No waiting, no lag.",
  },
  {
    icon: <Code className="h-6 w-6 text-accent" />,
    title: "GitHub & LinkedIn Sync",
    description:
      "Import repositories, commit graphs, and experience directly from your professional profiles with automated updates.",
  },
  {
    icon: <Shield className="h-6 w-6 text-primary" />,
    title: "SEO & Speed Optimized",
    description:
      "Every generated portfolio scores a perfect 100 on Lighthouse, featuring semantic markup, schema, and meta tagging.",
  },
];

const showcaseThemes = [
  {
    id: "minimalist",
    name: "Modern Minimalist",
    bgColor: "bg-slate-50 dark:bg-slate-900/50",
    accentColor: "from-blue-500 to-indigo-600",
    fontClass: "font-sans",
    tagline:
      "Clean layouts with subtle visual cues and high typographic priority.",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
  },
  {
    id: "cyberpunk",
    name: "Neon Cyberpunk",
    bgColor: "bg-zinc-950",
    accentColor: "from-fuchsia-500 to-cyan-400",
    fontClass: "font-mono text-cyan-400",
    tagline:
      "High contrast borders, retro grids, and glowing terminal panels.",
    skills: ["Rust", "Solidity", "WebAssembly", "Go"],
  },
  {
    id: "creative",
    name: "Playful Creative",
    bgColor: "bg-amber-50/50 dark:bg-amber-950/20",
    accentColor: "from-emerald-400 to-teal-600",
    fontClass: "font-serif",
    tagline: "Soft colors, organic shapes, and fluid micro-animations.",
    skills: ["Figma", "UI/UX", "Next.js", "Three.js"],
  },
  {
    id: "brutalist",
    name: "Neo-Brutalist",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    accentColor: "from-orange-500 to-yellow-500",
    fontClass: "font-black tracking-tight",
    tagline:
      "Heavy black borders, stark primary colors, and structural layout grids.",
    skills: ["Python", "Django", "PostgreSQL", "Docker"],
  },
];

const pricingPlans = [
  {
    name: "Hobbyist",
    price: "$0",
    description:
      "Perfect for students and developers starting their coding journey.",
    features: [
      "1 Generated Portfolio",
      "Standard Templates",
      "buildmyportfolio.com subdomain",
      "Basic AI writing assistance",
      "Ad-supported footer",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional Pro",
    price: "$12",
    period: "/month",
    description:
      "Our most popular package for active job seekers and freelancers.",
    features: [
      "Unlimited Portfolios",
      "All Premium Themes (Cyberpunk, Brutalist, etc)",
      "Custom Domain Support + Free SSL",
      "Advanced Gemini Writer (unlimited queries)",
      "Remove branding logo",
      "Priority analytics & visitor reports",
    ],
    cta: "Go Professional",
    popular: true,
  },
  {
    name: "Elite Agency",
    price: "$29",
    period: "/month",
    description:
      "Built for developer agencies, design houses, and power users.",
    features: [
      "Everything in Pro",
      "Multi-user team dashboard",
      "Custom HTML/CSS injection",
      "White label portfolio portals",
      "Dedicated account support",
      "Automated PDF resume generator",
    ],
    cta: "Claim Elite Tier",
    popular: false,
  },
];

const faqs = [
  {
    q: "How does the Gemini AI portfolio generator work?",
    a: "Simply input your job title, experience summaries, and skill keywords, or paste a link to your LinkedIn / GitHub. Our Gemini engine maps your achievements into structure-optimized schemas, writes compelling portfolio bio sections, organizes your projects, and matches your profile to the perfect theme.",
  },
  {
    q: "Can I connect my own custom domain?",
    a: "Yes! Custom domain routing is available on all Pro and Elite plans. We handle SSL registration and renewal automatically through Firebase and Cloudflare edge gateways.",
  },
  {
    q: "Am I locked into a template?",
    a: "Never. Your portfolio data is separate from the layout theme. You can switch templates, colors, or fonts at any time with a single click in your editor dashboard without losing any written content.",
  },
  {
    q: "What integrations do you support?",
    a: "We support direct sync with GitHub (repositories, README files, contribution calendar), LinkedIn (work history, skills), Medium/Dev.to (blog posts), and standard contact forms with Firebase Firestore database integration.",
  },
];

export default function LandingPage() {
  const [selectedTheme, setSelectedTheme] = useState("minimalist");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const currentThemeData =
    showcaseThemes.find((t) => t.id === selectedTheme) || showcaseThemes[0];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28 lg:pb-24 border-b border-border bg-gradient-to-b from-background to-secondary/10">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-12 left-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-24 right-1/4 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary mb-6"
          >
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
            Gemini-Powered Website Builder
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground"
          >
            Create Your Developer Portfolio
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[size:200%] bg-clip-text text-transparent">
              Powered by AI in Seconds.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-muted-foreground"
          >
            Showcase your projects, work experience, and developer skills with
            premium custom templates. Zero coding required, fully
            SEO-optimized, and hosted free.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:-translate-y-0.5 duration-200"
            >
              Start Generating Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#themes"
              className="rounded-xl border border-border bg-background/55 backdrop-blur-sm px-6 py-3.5 text-base font-semibold hover:bg-muted/80 transition-all duration-200"
            >
              Explore Templates
            </Link>
          </motion.div>

          {/* Editor Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-16 relative mx-auto max-w-5xl rounded-2xl border border-border bg-card/60 p-2 shadow-2xl backdrop-blur-md"
          >
            <div className="rounded-xl border border-border bg-background overflow-hidden shadow-inner">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <div className="text-xs text-muted-foreground font-mono bg-background border border-border px-8 py-1 rounded-md max-w-sm truncate">
                  buildmyportfolio.com/dashboard/editor
                </div>
                <div className="w-12" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 h-[480px]">
                <div className="border-r border-border bg-muted/20 p-6 hidden md:flex flex-col justify-between">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        AI Generator Input
                      </h4>
                      <div className="mt-2.5 rounded-lg border border-border bg-background p-3 text-left">
                        <p className="text-xs text-foreground font-medium">
                          &quot;Full-stack engineer with 4 years React/Node
                          experience. Focus on SaaS dashboards, PostgreSQL,
                          Docker, and tailwind. Keep the design dark and
                          minimalist.&quot;
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Portfolio Styling
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {showcaseThemes.map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => setSelectedTheme(theme.id)}
                            className={cn(
                              "rounded-lg border px-3 py-2 text-xs font-semibold text-center transition-all",
                              selectedTheme === theme.id
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:bg-muted text-muted-foreground"
                            )}
                          >
                            {theme.name.split(" ")[1]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 p-4 text-left">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles className="h-4 w-4 text-accent" />
                      <span className="text-xs font-bold">Gemini is Ready</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Layout structures adjusted dynamically based on your
                      developer profile.
                    </p>
                  </div>
                </div>

                <div className="col-span-2 p-6 flex flex-col justify-between bg-muted/10 relative overflow-y-auto">
                  <div className="absolute top-3 right-4 flex gap-1.5 z-10 bg-background border border-border rounded-lg p-1">
                    <button className="rounded p-1 hover:bg-muted bg-muted text-primary" aria-label="Desktop view">
                      <Monitor className="h-3.5 w-3.5" />
                    </button>
                    <button className="rounded p-1 hover:bg-muted text-muted-foreground" aria-label="Mobile view">
                      <Smartphone className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedTheme}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={cn(
                        "rounded-xl border border-border p-6 shadow-md h-full flex flex-col justify-between transition-all duration-300",
                        currentThemeData.bgColor
                      )}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-border/80 pb-3">
                          <span className={cn("text-sm font-bold", currentThemeData.fontClass)}>
                            Alex Carter
                          </span>
                          <div className="flex gap-2.5 text-[10px] text-muted-foreground">
                            <span>About</span>
                            <span>Projects</span>
                            <span>Contact</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-left">
                          <h3 className={cn("text-xl font-bold", currentThemeData.fontClass)}>
                            Full-Stack Engineer.
                          </h3>
                          <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
                            {currentThemeData.tagline}
                          </p>
                        </div>

                        <div className="text-left space-y-1.5">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                            Core Capabilities
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {currentThemeData.skills.map((skill) => (
                              <span
                                key={skill}
                                className={cn(
                                  "rounded px-2 py-0.5 text-[9px] font-semibold border border-border bg-background",
                                  selectedTheme === "cyberpunk" && "border-cyan-500/30 text-cyan-400 bg-cyan-950/20"
                                )}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-border/80 pt-3">
                        <span className="text-[9px] text-muted-foreground font-mono">
                          Generated via BuildMyPortfolio
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold">
                          <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", currentThemeData.accentColor)}>
                            Explore Projects
                          </span>
                          <ArrowRight className="h-3 w-3 text-primary" />
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 lg:py-28 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Everything You Need to Shine Online.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our comprehensive system handles formatting, copywriting,
              deployment, and performance, leaving you free to write code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative rounded-2xl border border-border p-6 hover:shadow-lg transition-all duration-300 bg-card/45 hover:-translate-y-1 hover:border-primary/45"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/80 group-hover:bg-primary/10 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Theme Showcase */}
      <section id="themes" className="py-20 lg:py-28 bg-secondary/10 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Choose the Layout that Represents You Best
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Whether you need a clean minimalist look for enterprise
                applications, a terminal-style layout for compiler design, or a
                brutalist interface for bold creative experiments.
              </p>
              <div className="space-y-3">
                {showcaseThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={cn(
                      "flex items-start gap-4 w-full rounded-xl border p-4 text-left transition-all duration-200",
                      selectedTheme === theme.id
                        ? "border-primary bg-background shadow-md translate-x-2"
                        : "border-border/60 hover:bg-background/50 hover:translate-x-1"
                    )}
                  >
                    <div className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr", theme.accentColor)}>
                      {selectedTheme === theme.id && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{theme.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{theme.tagline}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 rounded-2xl border border-border bg-background p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                Live Dynamic Showcase Preview
              </h3>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTheme}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className={cn("rounded-2xl border border-border p-8 min-h-[360px] flex flex-col justify-between transition-all duration-300", currentThemeData.bgColor)}
                >
                  <div className="space-y-6 text-left">
                    <div className="flex items-center justify-between border-b border-border/70 pb-4">
                      <div>
                        <h4 className={cn("text-xl font-bold", currentThemeData.fontClass)}>Sarah Jenkins</h4>
                        <p className="text-xs text-muted-foreground">Systems Architect &amp; Go Dev</p>
                      </div>
                      <span className="rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1 text-[10px] font-semibold text-green-500">
                        Available for Contract
                      </span>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm leading-relaxed text-foreground">
                        I build resilient Kubernetes microservices, distributed
                        logging middleware, and custom network tools. Highly
                        optimized for scale, latency, and observability.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {currentThemeData.skills.map((skill) => (
                          <span
                            key={skill}
                            className={cn(
                              "rounded-lg px-2.5 py-1 text-[11px] font-semibold border border-border bg-background",
                              selectedTheme === "cyberpunk" && "border-cyan-500/30 text-cyan-400 bg-cyan-950/20"
                            )}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-border/70 pt-4 text-xs text-muted-foreground">
                    <span>Active Theme: {currentThemeData.name}</span>
                    <span className={cn("flex items-center gap-1.5 font-bold bg-gradient-to-r bg-clip-text text-transparent", currentThemeData.accentColor)}>
                      View Work Portfolio
                      <ArrowRight className="h-3.5 w-3.5 text-primary" />
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 lg:py-28 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Clear Pricing. No Hidden Fees.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Unlock complete custom layouts, professional integrations, custom
              domains, and unrestricted AI writing support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "rounded-2xl border p-8 flex flex-col justify-between transition-all duration-300 bg-card/35 relative",
                  plan.popular
                    ? "border-primary shadow-xl scale-105 z-10 bg-background"
                    : "border-border hover:border-muted-foreground/30"
                )}
              >
                {plan.popular && (
                  <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1 text-xs font-bold text-white shadow-md">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight text-foreground">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm font-semibold text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <p className="mt-2.5 text-sm text-muted-foreground">{plan.description}</p>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-foreground">
                        <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Link
                    href="/register"
                    className={cn(
                      "block w-full rounded-xl py-3 text-center text-sm font-semibold shadow transition-all duration-200",
                      plan.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 lg:py-28 bg-secondary/15 border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Have questions about templates, domain setup, or AI customization? We have answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-xl border border-border bg-background overflow-hidden transition-all duration-200">
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-left font-bold text-base hover:bg-muted/30 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform duration-200", activeFaq === index && "rotate-180 text-primary")} />
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="border-t border-border p-5 text-sm leading-relaxed text-muted-foreground bg-muted/10">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden py-24 bg-secondary">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative space-y-8">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-white">
            Ready to Build Your Portfolio Website?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            Join thousands of developers using BuildMyPortfolio to showcase
            their projects, sync commit histories, and land engineering roles.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-primary/90 transition-all hover:-translate-y-0.5 duration-200"
            >
              Start Generating Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-slate-700 bg-slate-900/60 text-white hover:bg-slate-900 px-8 py-4 text-base font-semibold transition-all duration-200"
            >
              Sign In to Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
