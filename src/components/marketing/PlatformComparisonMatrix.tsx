"use client";

import { motion } from "framer-motion";
import { Check, X, Sparkles, Zap, ShieldCheck } from "lucide-react";

export function PlatformComparisonMatrix() {
  const comparisons = [
    {
      feature: "Development & Launch Time",
      bmp: "Under 2 Minutes",
      manual: "40+ Engineering Hours",
      bmpHighlight: true,
    },
    {
      feature: "AI Professional Bio & Project Writer",
      bmp: "Integrated Gemini AI Engine",
      manual: "Manual copywriting from scratch",
      bmpHighlight: true,
    },
    {
      feature: "Glassmorphic Theme Systems",
      bmp: "4 Presets (Cyberpunk, Brutalist, etc.)",
      manual: "Writing CSS design tokens & Tailwind",
      bmpHighlight: true,
    },
    {
      feature: "Lighthouse 100 Technical SEO",
      bmp: "Pre-configured JSON-LD & OpenGraph",
      manual: "Manual meta tags & schema setup",
      bmpHighlight: true,
    },
    {
      feature: "Domain & SSL Provisioning",
      bmp: "Instant Edge CDN Deployment",
      manual: "Configuring Vercel, DNS, & SSL",
      bmpHighlight: true,
    },
    {
      feature: "Automated QA Quality Audit",
      bmp: "WCAG AA & Web Vitals Scanner",
      manual: "Manual Lighthouse testing",
      bmpHighlight: true,
    },
  ];

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden text-center select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-wider">
            Platform Comparison
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            BuildMyPortfolio vs. Manual Coding
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            See why over 28,000 developers choose BuildMyPortfolio over weeks of manual Next.js configuration.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-3xl border border-border/60 bg-card/70 shadow-2xl backdrop-blur-2xl overflow-hidden text-left">
          <div className="grid grid-cols-3 bg-muted/40 p-4 border-b border-border/40 text-xs font-extrabold uppercase tracking-wider">
            <span className="text-muted-foreground">Capabilities</span>
            <span className="text-primary flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> BuildMyPortfolio
            </span>
            <span className="text-muted-foreground">Manual Coding</span>
          </div>

          <div className="divide-y divide-border/40">
            {comparisons.map((c, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="grid grid-cols-3 p-4 items-center text-xs font-medium hover:bg-muted/20 transition-colors"
              >
                <span className="font-bold text-foreground">{c.feature}</span>
                <span className="text-emerald-500 font-extrabold flex items-center gap-1.5">
                  <Check className="h-4 w-4 shrink-0" /> {c.bmp}
                </span>
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <X className="h-4 w-4 text-destructive shrink-0" /> {c.manual}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
