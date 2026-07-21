"use client";

import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { AmbientParticleCanvas } from "@/components/marketing/AmbientParticleCanvas";
import { MouseFollowGlow } from "@/components/marketing/MouseFollowGlow";
import { WorldClassHero } from "@/components/marketing/WorldClassHero";
import { AnimatedCounterStats } from "@/components/marketing/AnimatedCounterStats";
import { InteractivePlayground } from "@/components/marketing/InteractivePlayground";
import { WorkflowVisualization } from "@/components/marketing/WorkflowVisualization";
import { QualityScoreDemo } from "@/components/marketing/QualityScoreDemo";
import { PlatformComparisonMatrix } from "@/components/marketing/PlatformComparisonMatrix";
import { ROICalculator } from "@/components/marketing/ROICalculator";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Star } from "lucide-react";

export default function HomePage() {
  const testimonials = [
    {
      name: "Marcus Vance",
      role: "Staff Software Engineer at Meta",
      text: "BuildMyPortfolio created a portfolio that got me 4 interview callbacks within 48 hours. The Gemini AI copywriting is astonishingly accurate.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Sophia Chen",
      role: "Lead Product Designer at Stripe",
      text: "The glassmorphic themes and Cyberpunk layout are gorgeous. It feels like hiring a senior design agency for $0.",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "David Kalu",
      role: "Cloud DevOps Architect",
      text: "The custom domain mapping and automated SSL deployment on global CDNs worked flawlessly. Saved me 30 hours of Next.js setup.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 relative">
      {/* Background Motion Effects */}
      <AmbientParticleCanvas />
      <MouseFollowGlow />

      <Navbar />

      <main className="flex-1 relative z-10">
        {/* World-Class Hero with Live Streaming AI Demo */}
        <WorldClassHero />

        {/* Animated Counter Stats */}
        <AnimatedCounterStats />

        {/* Live Interactive Playground Sandbox */}
        <InteractivePlayground />

        {/* 4-Stage AI Pipeline Showcase */}
        <WorkflowVisualization />

        {/* Automated QA Audit Scanner Demo */}
        <QualityScoreDemo />

        {/* Platform Comparison Matrix */}
        <PlatformComparisonMatrix />

        {/* ROI Time & Cost Savings Calculator */}
        <ROICalculator />

        {/* Testimonials */}
        <section className="py-16 sm:py-24 relative overflow-hidden text-center select-none">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-3xl mx-auto space-y-3">
              <span className="px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-wider">
                Customer Success Stories
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Loved by Engineers &amp; Designers Worldwide
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {testimonials.map((t, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">"{t.text}"</p>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-border/40">
                    <img src={t.avatar} alt={t.name} className="h-9 w-9 rounded-full object-cover border border-border" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{t.name}</h4>
                      <p className="text-[10px] text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="py-16 sm:py-20 relative overflow-hidden text-center select-none">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card/80 to-primary/20 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl space-y-6">
              <span className="px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-wider">
                Ready to Launch?
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-foreground">
                Build Your Personal Portfolio Today
              </h2>
              <p className="text-xs sm:text-base text-muted-foreground max-w-xl mx-auto font-medium leading-relaxed">
                Join over 28,000 developers and designers who present their work with BuildMyPortfolio.
              </p>
              <div className="pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-black text-sm shadow-xl shadow-primary/25 hover:opacity-95 transition-all cursor-pointer"
                >
                  Create Your Portfolio Free <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
