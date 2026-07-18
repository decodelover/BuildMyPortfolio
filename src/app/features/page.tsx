"use client";

import Link from "next/link";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Globe,
  Layout,
  Code,
  Shield,
  ArrowRight,
  Layers,
  LineChart,
  RefreshCw,
  Search,
  CheckCircle,
  FileText
} from "lucide-react";

const detailedFeatures = [
  {
    icon: <Sparkles className="h-5 w-5 text-accent" />,
    title: "AI Website Generation",
    description: "Write compelling bio sections, summarize your career achievements, and formulate technical projects with an editor backing from Google Gemini.",
    badge: "Intelligence",
  },
  {
    icon: <Layout className="h-5 w-5 text-primary" />,
    title: "Responsive Premium Themes",
    description: "Access curated developer styles: Neon Cyberpunk, Brutalist Grid, and Corporate Minimalist. All layouts adapt to mobile, tablet, and desktop.",
    badge: "Design",
  },
  {
    icon: <Globe className="h-5 w-5 text-accent" />,
    title: "Instant Edge DNS Connection",
    description: "Deploy to a free buildmyportfolio.com subdomain with secure SSL instantly, or link your own custom domain name securely with global edge delivery.",
    badge: "Hosting",
  },
  {
    icon: <Code className="h-5 w-5 text-primary" />,
    title: "Live GitHub Syncing",
    description: "Automatically pull your public repositories, languages stats, contribution maps, and project readmes without writing updates.",
    badge: "Git Sync",
  },
  {
    icon: <LineChart className="h-5 w-5 text-accent" />,
    title: "Real-Time Traffic Analytics",
    description: "Track unique visits, click rates, referrer origins, and country insights using an integrated dashboard designed for technology builders.",
    badge: "Metrics",
  },
  {
    icon: <Shield className="h-5 w-5 text-primary" />,
    title: "Lighthouse 100 SEO",
    description: "Rank higher on engineering searches. We generate optimized semantic markup, custom metatags, fast loading assets, and JSON-LD structural graphs.",
    badge: "SEO Pre-config",
  },
  {
    icon: <Layers className="h-5 w-5 text-accent" />,
    title: "Resume Data Importer",
    description: "Upload your existing PDF resume or paste a link to your LinkedIn profile. Our parser extracts experience, education, and credentials instantly.",
    badge: "Data Import",
  },
  {
    icon: <RefreshCw className="h-5 w-5 text-primary" />,
    title: "Version History Backups",
    description: "Switch layouts, restore drafts, or back up configurations easily. We maintain revisions histories so your content remains fully protected.",
    badge: "Revisions",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    },
  },
};

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Header section */}
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
            <Zap className="h-3.5 w-3.5 text-accent animate-pulse" />
            Complete Feature Catalog
          </motion.div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
            Designed for Developers.{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Engineered to Showcase Excellence.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
            BuildMyPortfolio features sub-second CDN loading speed, automated profile updates, Google Gemini assisted copywriting, and fully customizable themes.
          </p>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left"
          >
            {detailedFeatures.map((feat) => (
              <motion.div
                key={feat.title}
                variants={itemVariants}
                className="group relative rounded-2xl border border-border bg-card/45 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary transition-all duration-300">
                      {feat.icon}
                    </div>
                    <span className="rounded-full bg-secondary/80 px-2 py-0.5 text-[8px] font-extrabold tracking-wider uppercase text-muted-foreground border border-border/40">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {feat.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Editor Mockup */}
      <section className="py-20 lg:py-24 bg-secondary/5 border-t border-b border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:14px_24px] opacity-80" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6 text-left">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-primary">Advanced Customizer</span>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Dynamic visual settings &amp; fast template swapping
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Need to tailor your look to a specific job vacancy? Swap your theme or update styling parameters directly from your editor. Changes update instantly across all edge routes.
              </p>
              <div className="space-y-4 pt-2">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 text-xs font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Select a baseline template layout</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Toggle themes instantly without modifying project text details.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10 text-accent shrink-0 text-xs font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Deploy dynamically to SSL edge hosting</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Push your portfolio code directly to deployment nodes.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-2xl border border-border/50 bg-card/65 p-4 shadow-xl backdrop-blur-md">
              <div className="rounded-xl border border-border bg-background overflow-hidden h-[340px] flex flex-col justify-between">
                <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border bg-muted/40 text-xs text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-destructive/80" />
                  <div className="h-2 w-2 rounded-full bg-amber-500/80" />
                  <div className="h-2 w-2 rounded-full bg-green-500/80" />
                  <span className="ml-4 font-mono text-[10px]">buildmyportfolio.com/editor/templates</span>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between items-center text-center">
                  <Layout className="h-14 w-14 text-primary animate-bounce pt-2" />
                  <div className="space-y-1 max-w-sm">
                    <h4 className="text-xs font-bold">Theme Configurator Active</h4>
                    <p className="text-[11px] text-muted-foreground leading-normal">
                      Switch between Cyberpunk, Stark Brutalist, and Professional Minimalist styles to find your perfect online match.
                    </p>
                  </div>
                  <div className="flex gap-3 text-[10px] font-bold uppercase tracking-wider">
                    <span className="rounded-lg border border-border px-3 py-1.5 bg-muted">Minimalist</span>
                    <span className="rounded-lg border border-primary bg-primary/10 text-primary px-3 py-1.5">Cyberpunk</span>
                    <span className="rounded-lg border border-border px-3 py-1.5 bg-muted">Brutalist</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 text-center relative overflow-hidden bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:14px_24px] opacity-80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-primary/10 blur-3xl opacity-60" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative space-y-6">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Ready to generate your portfolio?
          </h2>
          <p className="mx-auto max-w-xl text-zinc-400 text-xs sm:text-sm leading-relaxed">
            Create an account, enter your professional history, and watch our AI synthesize your achievements into a premium developer website.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-primary/95 transition-all duration-200"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-slate-800 bg-slate-900/60 text-white hover:bg-slate-900 px-7 py-3.5 text-xs font-bold transition-all duration-200"
            >
              See Pricing Options
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
