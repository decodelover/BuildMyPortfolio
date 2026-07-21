"use client";

import Link from "next/link";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { ScrollReveal } from "@/components/marketing/ScrollReveal";
import { AmbientParticleCanvas } from "@/components/marketing/AmbientParticleCanvas";
import { MouseFollowGlow } from "@/components/marketing/MouseFollowGlow";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Globe,
  Layout,
  Code,
  Shield,
  ArrowRight,
  Search,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";

export default function FeaturesPage() {
  const detailedFeatures = [
    {
      icon: Sparkles,
      title: "AI Copywriting & Copy Agent",
      description: "Auto-formulate punchy developer bios, job achievements, and project descriptions powered by Gemini AI.",
      badge: "AI Copywriting",
    },
    {
      icon: Layout,
      title: "Glassmorphism & Responsive Themes",
      description: "Access Cyberpunk, Brutalist, Creative, and Minimalist theme systems built with Tailwind CSS and Framer Motion.",
      badge: "Design",
    },
    {
      icon: Globe,
      title: "Instant Edge CDN Publishing",
      description: "Deploy to custom domain names with automatic SSL certificates or use subdomains hosted on edge servers.",
      badge: "Hosting",
    },
    {
      icon: Search,
      title: "Lighthouse 100 Technical SEO",
      description: "Injects JSON-LD structured schemas, OpenGraph preview cards, fast asset loading, and canonical meta links.",
      badge: "SEO Engine",
    },
    {
      icon: ShieldCheck,
      title: "Automated QA Quality Audit",
      description: "Scans your site for WCAG AA contrast compliance, broken links, image alt texts, and performance scores.",
      badge: "Quality Assurance",
    },
    {
      icon: Code,
      title: "React Source Code Export",
      description: "Export full Next.js 15 React source code bundles (.zip) for local execution or custom Git deployments.",
      badge: "Source Export",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 relative">
      <AmbientParticleCanvas />
      <MouseFollowGlow />

      <Navbar />

      <main className="flex-1 py-16 sm:py-24 text-left relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <ScrollReveal direction="down">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <span className="px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-wider">
                Enterprise Feature Matrix
              </span>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
                Everything You Need to Build &amp; Host High-Impact Portfolios
              </h1>
              <p className="text-xs sm:text-base text-muted-foreground font-medium leading-relaxed">
                Explore the technology stack powering automated portfolio generation, theme compilation, and global edge deployments.
              </p>
            </div>
          </ScrollReveal>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {detailedFeatures.map((f, idx) => {
              const Icon = f.icon;
              return (
                <ScrollReveal key={idx} direction="up" delay={idx * 0.1}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-4 hover:border-primary/40 transition-all flex flex-col justify-between h-full"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
                          {f.badge}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-foreground">{f.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium">{f.description}</p>
                    </div>

                    <div className="pt-3 border-t border-border/40 flex items-center gap-1 text-[10px] font-bold text-primary">
                      <CheckCircle className="h-3.5 w-3.5" /> Production Ready
                    </div>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* CTA Banner */}
          <ScrollReveal direction="zoom">
            <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card/80 to-primary/15 p-8 text-center space-y-4 shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">Start Building Your Portfolio Free</h2>
              <p className="text-xs text-muted-foreground max-w-lg mx-auto">
                Launch your site in under 2 minutes. No credit card required.
              </p>
              <div>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:opacity-90 transition-opacity"
                >
                  Create Portfolio Free <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
