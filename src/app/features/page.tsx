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
  MousePointerClick,
  Layers,
  LineChart,
} from "lucide-react";

const detailedFeatures = [
  {
    icon: <Sparkles className="h-6 w-6 text-accent" />,
    title: "AI-Powered Copywriting & Synthesis",
    description: "Write compelling bio sections, summarize your career milestones, and explain technical projects with an intuitive editor built on Google Gemini.",
    badge: "Intelligence",
  },
  {
    icon: <Layout className="h-6 w-6 text-primary" />,
    title: "Responsive Premium Templates",
    description: "Access curated developer styles: Neon Cyberpunk, Brutalist Grid, and Corporate Minimalist. All layouts adapt beautifully to mobile, tablet, and desktop viewports.",
    badge: "Design",
  },
  {
    icon: <Globe className="h-6 w-6 text-accent" />,
    title: "Instant Edge DNS & Subdomains",
    description: "Deploy to a free buildmyportfolio.com subdomain with secure SSL instantly, or link your own custom domain name securely with global edge delivery.",
    badge: "Hosting",
  },
  {
    icon: <Code className="h-6 w-6 text-primary" />,
    title: "Live GitHub Repository Syncing",
    description: "Automatically pull your active public repositories, languages list, commit activity graph, and project readmes without writing manual updates.",
    badge: "Sync",
  },
  {
    icon: <LineChart className="h-6 w-6 text-accent" />,
    title: "Real-Time Traffic Analytics",
    description: "Track unique visits, click rates, referrer origins, and geolocation insights using an integrated, zero-cookie dashboard designed for developers.",
    badge: "Metrics",
  },
  {
    icon: <Shield className="h-6 w-6 text-primary" />,
    title: "Lighthouse 100 SEO Pre-Configs",
    description: "Rank higher on engineering team searches. We output fully semantic schema markup, custom metatags, fast loading assets, and JSON-LD structural graphs.",
    badge: "SEO",
  },
  {
    icon: <Layers className="h-6 w-6 text-accent" />,
    title: "Resume Parser & Data Importer",
    description: "Upload your existing PDF resume or paste a link to your LinkedIn profile. Our importer extracts experience dates, education, and credentials instantly.",
    badge: "Migration",
  },
  {
    icon: <MousePointerClick className="h-6 w-6 text-primary" />,
    title: "Dynamic WYSIWYG Visual Editor",
    description: "Customize fonts, palettes, and social media handles in real-time. Hit publish and see changes take effect instantly across all active portfolio instances.",
    badge: "Editor",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Header section */}
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
            <Zap className="h-4 w-4 text-accent animate-pulse" />
            Complete Feature Catalog
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground"
          >
            Designed for Developers,
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Engineered to Land Offers.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Say goodbye to vanilla HTML and templates. BuildMyPortfolio delivers blazing fast site performance, integrated analytics, automated profile updates, and Gemini-driven copy.
          </motion.p>
        </div>
      </section>

      {/* Grid items */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {detailedFeatures.map((feat) => (
              <motion.div
                key={feat.title}
                variants={itemVariants}
                className="group relative rounded-2xl border border-border p-6 shadow-md bg-card/60 backdrop-blur-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/80 group-hover:bg-primary/10 transition-colors duration-300">
                      {feat.icon}
                    </div>
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feat.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Editor preview mockups */}
      <section className="py-20 lg:py-24 bg-secondary/5 border-t border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] opacity-45" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6 text-left">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Dynamic visual settings &amp; fast template swapping
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Need to tailor your look to a specific job vacancy? Swap your theme or update styling parameters directly from your editor. Changes update instantly across all edge routes.
              </p>
              <div className="space-y-4 pt-2">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Select a baseline template layout</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Toggle themes instantly without modifying project text details.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Deploy dynamically to SSL edge hosting</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Push your portfolio code directly to deployment nodes.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-2xl border border-border bg-card/60 p-4 shadow-xl backdrop-blur-md">
              <div className="rounded-xl border border-border bg-background overflow-hidden h-[340px] flex flex-col">
                <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border bg-muted/40 text-xs text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-red-500/80" />
                  <div className="h-2 w-2 rounded-full bg-yellow-500/80" />
                  <div className="h-2 w-2 rounded-full bg-green-500/80" />
                  <span className="ml-4 font-mono">buildmyportfolio.com/editor/templates</span>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between items-center text-center bg-[radial-gradient(circle_at_center,var(--color-primary-light)_0%,transparent_70%)]">
                  <Layout className="h-16 w-16 text-primary animate-bounce pt-2" />
                  <div className="space-y-1 max-w-sm">
                    <h4 className="text-sm font-bold">Theme Configurator Active</h4>
                    <p className="text-xs text-muted-foreground">
                      Switch between Cyberpunk, Neo-Brutalist, and Professional Minimalist styles to find your perfect online match.
                    </p>
                  </div>
                  <div className="flex gap-3 text-xs font-semibold">
                    <span className="rounded-lg border px-4 py-1.5 bg-muted">Minimalist</span>
                    <span className="rounded-lg border px-4 py-1.5 border-primary bg-primary/10 text-primary">Cyberpunk</span>
                    <span className="rounded-lg border px-4 py-1.5 bg-muted">Brutalist</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 text-center relative overflow-hidden bg-secondary">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Ready to generate your portfolio?
          </h2>
          <p className="mx-auto max-w-xl text-slate-300 text-sm sm:text-base leading-relaxed">
            Create an account, enter your professional history, and watch our AI synthesize your achievements into a premium developer website.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-primary/95 transition-all duration-200"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-slate-700 bg-slate-900/60 text-white hover:bg-slate-900 px-8 py-3.5 text-base font-semibold transition-all duration-200"
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
