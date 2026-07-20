"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
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
  Star,
  Layers,
  LineChart,
  UserCheck,
  RefreshCw,
  Search,
  MessageSquare,
  HelpCircle,
  AlertCircle
} from "lucide-react";

// Technologies lists
const trustTechnologies = [
  { name: "Next.js", icon: (className: string) => (
    <svg className={className} viewBox="0 0 180 180" fill="currentColor">
      <path d="M90 0a90 90 0 100 180 90 90 0 000-180zm37.5 133L71.8 58v30.5H58V50h12.5l55.7 75v8z" />
      <path d="M110 50h14v82h-14V50z" />
    </svg>
  )},
  { name: "React", icon: (className: string) => (
    <svg className={className} viewBox="0 0 841.9 733.3" fill="none" stroke="currentColor" strokeWidth="30">
      <ellipse rx="84" ry="24" transform="translate(420.95 366.65)"/>
      <ellipse rx="84" ry="24" transform="translate(420.95 366.65) rotate(60)"/>
      <ellipse rx="84" ry="24" transform="translate(420.95 366.65) rotate(120)"/>
      <circle cx="420.95" cy="366.65" r="32" fill="currentColor"/>
    </svg>
  )},
  { name: "TypeScript", icon: (className: string) => (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor">
      <path d="M0 0h100v100H0z" fill="#3178C6"/>
      <path d="M72.2 68.8c.4 3.7.8 5.6 2.5 7 1.8 1.4 4.5 2.1 7.2 2.1 4.7 0 7.8-2 7.8-6.1 0-3.3-2.1-5.2-6.5-6.6l-5.6-1.8c-7.6-2.4-11.4-6.4-11.4-12.8 0-7.2 5.5-12.4 14.5-12.4 6 0 10.9 2 13.8 5.9 2.5 3.3 3.1 6.5 3.2 11.2h-9.3c0-3.5-.8-5.3-2.1-6.6-1.4-1.2-3.6-1.9-6-1.9-4.1 0-6.4 1.8-6.4 4.9 0 2.8 1.9 4.3 6.1 5.6l5.6 1.8c9.5 3 13.4 7.2 13.4 14.1 0 8.3-6.1 13.5-16.7 13.5-7.7 0-13.8-2.6-17.1-7.7-2.3-3.6-2.5-6.7-2.6-12.2h9.1zm-48.8-32h11.2v46.1H45V36.8h11.2v-7.3H23.4v7.3z" fill="#FFF"/>
    </svg>
  )},
  { name: "Firebase", icon: (className: string) => (
    <svg className={className} viewBox="0 0 128 128" fill="currentColor">
      <path d="M22.8 94.7L36.6 6.8c.3-2 2-3.4 4-3.1 1.2.2 2.2 1 2.7 2L55.8 28l-33 66.7z" fill="#FFC229"/>
      <path d="M104.7 94.7L91.2 24.3c-.4-2-2.3-3.2-4.3-2.8-1.2.3-2.1 1.2-2.4 2.3L71.8 45.4l32.9 49.3z" fill="#FFA712"/>
      <path d="M22.8 94.7l.6-1.2 55.4-56.7.6.2 25.3 57.7c.9 2.1-.2 4.6-2.4 5.5-.8.3-1.6.4-2.4.3H27.1c-2.3.1-4.2-1.7-4.3-4-.1-.8.1-1.7.5-2.4z" fill="#FF7043"/>
    </svg>
  )},
  { name: "GitHub", icon: (className: string) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )},
  { name: "Vercel", icon: (className: string) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 22.525H0L12 1.733l12 20.792z" />
    </svg>
  )},
  { name: "Gemini AI", icon: (className: string) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c.28 0 .54.18.64.44l2.12 5.3c.12.3.36.54.66.66l5.3 2.12c.26.1.44.36.44.64s-.18.54-.44.64l-5.3 2.12c-.3.12-.54.36-.66.66l-2.12 5.3c-.1.26-.36.44-.64.44s-.54-.18-.64-.44l-2.12-5.3c-.12-.3-.36-.54-.66-.66l-5.3-2.12C.18 9.54 0 9.28 0 9s.18-.54.44-.64l5.3-2.12c.3-.12.54-.36.66-.66l2.12-5.3C8.82.18 9.08 0 9.36 0c.26 0 .54.18.64.44l2 5c.12.3.36.54.66.66l5 2c.26.1.44.36.44.64s-.18.54-.44.64l-5 2c-.3.12-.54.36-.66.66l-2 5c-.1.26-.36.44-.64.44s-.54-.18-.64-.44l-2.12-5.3c-.12-.3-.36-.54-.66-.66l-5.3-2.12C.18 9.54 0 9.28 0 9s.18-.54.44-.64l5.3-2.12c.3-.12.54-.36.66-.66l2.12-5.3C8.82.18 9.08 0 9.36 0z" />
    </svg>
  )},
  { name: "Framer Motion", icon: (className: string) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 0h12v12H0V0zm12 12h12v12H12V12zM0 12h12v12H0V12zm12-12h12v12H12V0z" />
    </svg>
  )},
  { name: "Tailwind CSS", icon: (className: string) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 6.036c-2.286 0-3.81 1.144-4.572 3.432 1.143-1.525 2.476-2.097 4-1.716.87.217 1.492.848 2.18 1.548C14.73 10.378 15.908 11.5 18 11.5c2.286 0 3.81-1.144 4.572-3.432-1.143 1.525-2.476 2.097-4 1.716-.87-.217-1.492-.848-2.18-1.548C15.27 7.158 14.092 6.036 12 6.036zm-6 5.464c-2.286 0-3.81 1.144-4.572 3.432 1.143-1.525 2.476-2.097 4-1.716.87.217 1.492.848 2.18 1.548C9.73 15.842 10.908 17.5 13 17.5c2.286 0 3.81-1.144 4.572-3.432-1.143 1.525-2.476 2.097-4 1.716-.87-.217-1.492-.848-2.18-1.548C10.27 12.622 9.092 11.5 7 11.5z" />
    </svg>
  )}
];

// Steps configured
const worksSteps = [
  { id: "01", title: "Create Your Account", desc: "Sign up in seconds. Import your workspace profiles to preload basic credentials securely." },
  { id: "02", title: "Fill Out the AI Wizard", desc: "Describe your tech experience, select key technologies, and outline your standout projects." },
  { id: "03", title: "AI Scaffolds Website", desc: "Google Gemini compiles layout trees, writes professional headline bios, and formats schemas." },
  { id: "04", title: "Publish Instantly", desc: "Deploy to a custom domain or free subdomain with SSL enabled. Go live to the public with a click." }
];

// Core bento features
const coreFeatures = [
  {
    icon: <Sparkles className="h-5 w-5 text-accent" />,
    title: "AI Website Generation",
    desc: "Google Gemini translates plain text descriptions or resumes into beautiful layouts with zero layout work required.",
    badge: "Gemini AI"
  },
  {
    icon: <Layout className="h-5 w-5 text-primary" />,
    title: "Professional Themes",
    desc: "Vibrant designs ranging from Neon Cyberpunk to Corporate Minimalist and Gold Luxury styles, matching any designer taste.",
    badge: "Custom UI"
  },
  {
    icon: <Globe className="h-5 w-5 text-accent" />,
    title: "Instant Fast Hosting",
    desc: "Deploy instantly to global edge subdomains or configure custom routing with automated SSL certificates.",
    badge: "Edge Deploy"
  },
  {
    icon: <Code className="h-5 w-5 text-primary" />,
    title: "GitHub Repository Sync",
    desc: "Pull repositories, languages stats, contribution maps, and README files in real-time with continuous refreshes.",
    badge: "Git Integrations"
  },
  {
    icon: <Shield className="h-5 w-5 text-accent" />,
    title: "Perfect SEO Pre-Configs",
    desc: "Score 100 on Lighthouse. Generates optimized semantic markup, JSON-LD meta schemas, and page sitemaps out of the box.",
    badge: "SEO Engineered"
  },
  {
    icon: <Layers className="h-5 w-5 text-primary" />,
    title: "Resume Data Importer",
    desc: "Migrate instantly. Upload any PDF resume and watch the AI wizard auto-populate years of experience, courses, and jobs.",
    badge: "Smart Sync"
  },
  {
    icon: <LineChart className="h-5 w-5 text-accent" />,
    title: "Integrated Analytics",
    desc: "Monitor profile visitors, unique user tracking, browser referrals, and country stats with developer-friendly dashboards.",
    badge: "Dashboard Analytics"
  },
  {
    icon: <RefreshCw className="h-5 w-5 text-primary" />,
    title: "Version History Backups",
    desc: "Instantly revert design updates, restore previous drafts, or save multiple versions of your site structures safely.",
    badge: "Revisions Support"
  }
];

// Showcase themes preview
const themesList = [
  { id: "developer", name: "Developer Minimal", tag: "Nordic Minimalist", font: "font-sans", bg: "bg-slate-50 dark:bg-slate-900/60", accent: "from-blue-600 to-indigo-600", desc: "Clean font scaling, thin gray grid separators, and spacious layouts designed for software developers.", skills: ["React", "TypeScript", "Node.js", "Docker"] },
  { id: "cyberpunk", name: "Neon Cyberpunk", tag: "Terminal Console", font: "font-mono", bg: "bg-zinc-950", accent: "from-fuchsia-500 to-cyan-400", desc: "High contrast borders, retro cyber grids, glowing terminal command inputs, and retro mono spacing.", skills: ["Rust", "Solidity", "WebAssembly", "Go"] },
  { id: "startup", name: "Startup Tech", tag: "Modern Landing", font: "font-sans", bg: "bg-background/80", accent: "from-emerald-500 to-teal-600", desc: "Linear gradient containers, modern service features lists, and soft card shadow panels.", skills: ["Next.js", "Zustand", "Tailwind", "Firebase"] },
  { id: "agency", name: "Creative Agency", tag: "Stark Neo-Brutalist", font: "font-black tracking-tight", bg: "bg-yellow-50 dark:bg-amber-950/20", accent: "from-orange-500 to-yellow-500", desc: "Stark black borders, hard solid layouts, loud typography, and heavy brutalist design components.", skills: ["Figma", "Three.js", "Tailwind", "TailwindCSS"] },
  { id: "creative", name: "Creative Designer", tag: "Liquid Organic", font: "font-serif", bg: "bg-amber-50/40 dark:bg-zinc-900", accent: "from-rose-500 to-indigo-500", desc: "Soft round corners, serif headings, floating layout details, and playful color balances.", skills: ["UI/UX", "Brand Design", "Figma", "HTML5"] },
  { id: "luxury", name: "Gold Luxury", tag: "Luxury Elegant", font: "font-serif", bg: "bg-zinc-900", accent: "from-amber-400 to-yellow-600 text-amber-400", desc: "Serif typography, gold accents, deep black luxury palettes, and sleek border detailing.", skills: ["Advising", "CTO Consulting", "Architecture", "Cloud"] }
];

// Pricing details
const pricingPlans = [
  { name: "Hobbyist Starter", price: "$0", desc: "Perfect for students and early stage technology professionals getting started.", features: ["1 Active Portfolio Page", "Subdomain hosting (name.buildmyportfolio.com)", "Basic AI text generation assist", "Responsive templates access", "Default branding banner in footer"], badge: "Free Forever", popular: false },
  { name: "Professional Pro", price: "$39", desc: "Our recommended plan for developers, designers, and active job seekers.", features: ["Unlimited Active Portfolios", "Custom Domain Routing + Free SSL", "Advanced Gemini AI Copilot (unlimited queries)", "Import PDF Resume & Sync GitHub profiles", "Remove all branding logos", "Visitor Analytics Dashboard", "Priority email & chat support"], badge: "One-Time Payment", popular: true },
  { name: "Premium Agency", price: "$79", desc: "Built for developer networks, contractors, and agency founders.", features: ["Everything in Pro Plan", "White label client portals", "Custom code injection (HTML/JS metrics)", "Version history revisions log", "PDF resume layout generator", "Dedicated VIP slack support", "Multi-user collaborator access"], badge: "One-Time Payment", popular: false }
];

// Comparison Matrix
const matrixCategories = [
  {
    category: "AI Generation Features",
    items: [
      { name: "Google Gemini Writer Assistance", hobby: "Basic", pro: "Unlimited Advanced", premium: "Unlimited Advanced" },
      { name: "PDF Resume Parser Data Import", hobby: "✗", pro: "✓", premium: "✓" },
      { name: "LinkedIn & GitHub Bio Synthesis", hobby: "✗", pro: "✓", premium: "✓" },
    ]
  },
  {
    category: "Hosting & Domains",
    items: [
      { name: "Free SSL-secured Subdomain", hobby: "✓", pro: "✓", premium: "✓" },
      { name: "Custom Domain Connection", hobby: "✗", pro: "✓", premium: "✓" },
      { name: "Custom CSS/JS Injection", hobby: "✗", hobbyVal: "✗", pro: "✗", premium: "✓" },
    ]
  },
  {
    category: "Analytics & Tracking",
    items: [
      { name: "Traffic Visitor Reports", hobby: "Basic Views", pro: "Full Metrics", premium: "White label + Full Metrics" },
      { name: "Conversion Event Optimizations", hobby: "✗", pro: "✓", premium: "✓" },
    ]
  }
];

// FAQs configuration
const faqsList = [
  { q: "How does the AI portfolio generator build my website?", a: "The wizard takes your simple text credentials, resume upload, or sync profiles and routes them to Google Gemini. Gemini structures the data, drafts summary texts, separates projects, and automatically assigns a theme configured to score 100 on SEO and loading speed.", category: "AI" },
  { q: "Am I locked into a template once the site is generated?", a: "Never. Your layout design is separate from your database data. You can switch templates, colors, typography, or headers inside your editor dashboard instantly without losing any text fields.", category: "Themes" },
  { q: "Can I use my own custom domain names?", a: "Yes. Pro and Premium tiers allow you to link custom domains. We handle all edge CDN configuration, secure SSL registrations, and certificate renewals automatically.", category: "Domains" },
  { q: "Is the price really a one-time fee?", a: "Yes. We offer one-time checkout options for our Pro and Premium tiers. You pay once and receive lifetime hosting and builder access without monthly subscription obligations.", category: "Pricing" },
  { q: "What integrations do you support?", a: "We support real-time sync with GitHub repositories, LinkedIn work logs, Medium blog posts, Dev.to tutorials, and standard secure contact forms connected to Firestore.", category: "Support" },
  { q: "How does the PDF resume parser work?", a: "Simply upload your resume PDF in Step 1. Our parsing engine extracts your employment history, duration, certificates, and skills, automatically pre-loading them into the builder wizard.", category: "AI" }
];

const defaultLandingTestimonials = [
  {
    id: "default-1",
    review: "BuildMyPortfolio helped me launch a stunning, responsive portfolio in under 10 minutes. The multi-agent workflow generated clean copy and structured layouts seamlessly.",
    clientName: "Alex Rivera",
    position: "Senior Full-Stack Engineer",
    company: "TechCorp"
  },
  {
    id: "default-2",
    review: "The design system and automated SEO compilation saved me days of manual styling. My lighthouse scores were 100 straight out of the box.",
    clientName: "Sarah Chen",
    position: "Lead UI/UX Designer",
    company: "Studio Craft"
  },
  {
    id: "default-3",
    review: "An enterprise-grade tool for developers. The schema integrity, security checks, and snapshot versioning make this the best portfolio builder available.",
    clientName: "David Miller",
    position: "DevOps & Cloud Architect",
    company: "CloudScale"
  }
];

export default function LandingPage() {
  const [selectedTheme, setSelectedTheme] = useState("developer");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [faqSearch, setFaqSearch] = useState("");
  const [faqCategory, setFaqCategory] = useState("All");
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  // Load testimonials from Firestore with fallback
  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const q = query(collection(db, "testimonials"), limit(3));
        const snap = await getDocs(q);
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (list.length > 0) {
          setTestimonials(list);
        } else {
          setTestimonials(defaultLandingTestimonials);
        }
      } catch (err) {
        console.warn("Testimonial fetch notice (using default showcase testimonials):", err);
        setTestimonials(defaultLandingTestimonials);
      } finally {
        setLoadingTestimonials(false);
      }
    }
    fetchTestimonials();
  }, []);

  const currentThemeData = themesList.find((t) => t.id === selectedTheme) || themesList[0];

  const filteredFaqs = faqsList.filter((faq) => {
    const matchesSearch = faq.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
                          faq.a.toLowerCase().includes(faqSearch.toLowerCase());
    const matchesCategory = faqCategory === "All" || faq.category === faqCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-all duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28 lg:pb-32 border-b border-border/40">
        {/* Glow Effects */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-12 left-1/4 h-80 w-80 rounded-full bg-primary/10 blur-3xl opacity-60" />
        <div className="absolute top-24 right-1/4 h-80 w-80 rounded-full bg-accent/10 blur-3xl opacity-60" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary select-none"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
            Empowering Technology Professionals
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-[1.1]"
          >
            Build Professional Developer Websites with{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[size:200%] bg-clip-text text-transparent animate-gradient">
              AI In Minutes
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            Generate, customize, and deploy complete, production-ready developer portfolio websites in minutes with Google Gemini. Host free or connect your own domain.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-xs font-extrabold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all hover:scale-[1.02] duration-200"
            >
              Start Building Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#showcase"
              className="rounded-xl border border-border/80 bg-background px-7 py-3.5 text-xs font-extrabold hover:bg-muted/80 transition-all duration-200"
            >
              View Live Demos
            </Link>
          </motion.div>

          {/* Premium Animated Product Workspace Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-16 relative mx-auto max-w-5xl rounded-2xl border border-border/40 bg-card/45 p-2 shadow-2xl backdrop-blur-md"
          >
            <div className="rounded-xl border border-border bg-background overflow-hidden shadow-inner">
              {/* Header Bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/30">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-destructive/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <div className="text-[10px] text-muted-foreground font-mono bg-card border border-border/40 px-6 py-1 rounded-md max-w-xs truncate">
                  buildmyportfolio.com/dashboard/create
                </div>
                <div className="w-12" />
              </div>

              {/* Workspace Split Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
                {/* Left Side: Mock Wizard Inputs */}
                <div className="md:col-span-4 border-r border-border/60 bg-muted/15 p-6 flex flex-col justify-between text-left">
                  <div className="space-y-6">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-primary">Wizard Step 1</span>
                      <h4 className="text-xs font-bold text-foreground mt-1">AI Prompt Inputs</h4>
                      <div className="mt-2.5 rounded-xl border border-border/80 bg-background p-3 text-xs leading-relaxed text-muted-foreground">
                        &quot;Full-stack engineer with 4 years React/Node experience. Focus on cloud dashboards, databases, and SEO optimization. Make it feel modern.&quot;
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-foreground">Select Styling Presets</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {themesList.slice(0, 4).map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setSelectedTheme(t.id)}
                            className={cn(
                              "rounded-lg border py-2 text-[10px] font-semibold text-center transition-all cursor-pointer",
                              selectedTheme === t.id
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border/60 hover:bg-muted text-muted-foreground"
                            )}
                          >
                            {t.name.split(" ")[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 p-3.5 text-xs">
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
                      <span>Gemini Copilot Ready</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-normal">
                      Structuring portfolio data schemas and pre-filling headlines in real-time.
                    </p>
                  </div>
                </div>

                {/* Right Side: Mock Website Canvas View */}
                <div className="md:col-span-8 p-6 flex flex-col justify-between bg-muted/5 relative overflow-y-auto min-h-[380px]">
                  <div className="absolute top-4 right-4 flex gap-1 z-10 bg-background border border-border/60 rounded-lg p-1">
                    <button className="rounded p-1 bg-muted text-primary" aria-label="Desktop screen mockup">
                      <Monitor className="h-3.5 w-3.5" />
                    </button>
                    <button className="rounded p-1 hover:bg-muted text-muted-foreground" aria-label="Mobile screen mockup">
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
                        "rounded-xl border border-border/60 p-6 shadow-md h-full flex flex-col justify-between text-left transition-all duration-300",
                        currentThemeData.bg
                      )}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-border/80 pb-3">
                          <span className={cn("text-xs font-bold", currentThemeData.font)}>
                            Alex Rivera
                          </span>
                          <div className="flex gap-2.5 text-[9px] font-bold text-muted-foreground uppercase">
                            <span>About</span>
                            <span>Projects</span>
                            <span>Contact</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className={cn("text-lg font-black leading-tight", currentThemeData.font)}>
                            Full-Stack Software Engineer
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                            {currentThemeData.desc}
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted-foreground">
                            Expertise Fields
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {currentThemeData.skills.map((skill) => (
                              <span
                                key={skill}
                                className={cn(
                                  "rounded px-2 py-0.5 text-[9px] font-bold border border-border/60 bg-background",
                                  selectedTheme === "cyberpunk" && "border-cyan-500/30 text-cyan-400 bg-cyan-950/20"
                                )}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-border/80 pt-3 text-[9px]">
                        <span className="text-muted-foreground font-mono">
                          Live Subdomain: alex-rivera.buildmyportfolio.com
                        </span>
                        <div className="flex items-center gap-1 font-bold">
                          <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", currentThemeData.accent)}>
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

      {/* Trust Section */}
      <section className="py-12 border-b border-border/40 bg-secondary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground/80 mb-8">
            Engineered with Modern, Production-Grade Technologies
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-6 items-center justify-center">
            {trustTechnologies.map((tech) => (
              <div
                key={tech.name}
                className="flex flex-col items-center justify-center gap-2 group cursor-pointer"
                title={tech.name}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-card border border-border/40 text-muted-foreground group-hover:text-primary group-hover:border-primary/40 group-hover:shadow-md transition-all duration-300">
                  {tech.icon("h-6 w-6")}
                </div>
                <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works (Timeline) */}
      <section className="py-20 lg:py-28 border-b border-border/40 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Create and go live with a fully populated, highly optimized developer portfolio website in four straightforward steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connector Line for Desktop */}
            <div className="hidden md:block absolute top-7 left-10 right-10 h-[1.5px] bg-border -z-10" />

            {worksSteps.map((step, idx) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-start text-left bg-card/30 border border-border/50 rounded-2xl p-6 relative hover:border-primary/30 transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-xs shadow-md shadow-primary/20 mb-4 select-none">
                  {step.id}
                </div>
                <h3 className="text-sm font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 lg:py-28 border-b border-border/40 bg-secondary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Everything You Need to Showcase Expertise</h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              We compile formatting rules, sync profiles, draft headlines, and host layouts on the edge so you can focus on building products.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreFeatures.map((feat, idx) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group relative rounded-2xl border border-border/60 bg-card/45 p-6 hover:shadow-lg hover:-translate-y-1 hover:border-primary/45 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary transition-all duration-300">
                    {feat.icon}
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {feat.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted-foreground group-hover:text-primary">
                    {feat.badge}
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Showcase */}
      <section id="showcase" className="py-20 lg:py-28 border-b border-border/40 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Featured Showcase</h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Explore professional developer and designer layouts built by our users using the AI generator.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Showcase 1 */}
            <div className="group rounded-2xl border border-border/60 bg-card/30 p-4 hover:border-primary/30 transition-colors">
              <div className="relative aspect-video rounded-xl bg-slate-900 border border-border overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-left">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-primary mb-1">Cyberpunk Layout</span>
                  <h4 className="text-base font-bold text-white">Cryptocurrency Contract Developer</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-normal max-w-md">Rust programmer portfolio featuring glowing code lines and synced repos.</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 px-2">
                <span className="text-[10px] font-bold text-muted-foreground">Live Subdomain: rust-contract.buildmyportfolio.com</span>
                <Link href="/showcase" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  View Showcase <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Showcase 2 */}
            <div className="group rounded-2xl border border-border/60 bg-card/30 p-4 hover:border-primary/30 transition-colors">
              <div className="relative aspect-video rounded-xl bg-slate-950 border border-border overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-left">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-accent mb-1">Minimalist Layout</span>
                  <h4 className="text-base font-bold text-white">Full-Stack Cloud Engineer</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-normal max-w-md">Nordic gray portfolio showcasing database dashboards and API documentation.</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 px-2">
                <span className="text-[10px] font-bold text-muted-foreground">Live Subdomain: cloud-dev.buildmyportfolio.com</span>
                <Link href="/showcase" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  View Showcase <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Live Preview Selector */}
      <section id="themes" className="py-20 lg:py-28 border-b border-border/40 bg-secondary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6 text-left">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-primary">Live Preset Engine</span>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl leading-tight">
                Switch Presets Instantly. Customize Freely.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Whether you need a terminal neon style for low-level systems programming, or serif luxury lines for technical consulting. Your content updates automatically.
              </p>
              <div className="space-y-2.5">
                {themesList.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTheme(t.id)}
                    className={cn(
                      "flex items-start gap-4 w-full rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer",
                      selectedTheme === t.id
                        ? "border-primary bg-background shadow-md translate-x-2"
                        : "border-border/50 hover:bg-background/50 hover:translate-x-1"
                    )}
                  >
                    <div className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr", t.accent)}>
                      {selectedTheme === t.id && <Check className="h-2.5 w-2.5 text-white" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{t.name}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{t.tag}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 rounded-2xl border border-border/50 bg-background p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
              <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />

              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
                Live Dynamic Showcase Preview
              </h3>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTheme}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className={cn("rounded-xl border border-border/50 p-6 min-h-[350px] flex flex-col justify-between transition-all duration-300 text-left", currentThemeData.bg)}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border/70 pb-3">
                      <div>
                        <h4 className={cn("text-sm font-bold", currentThemeData.font)}>Marcus Vance</h4>
                        <p className="text-[10px] text-muted-foreground">Principal Cloud DevOps</p>
                      </div>
                      <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[9px] font-semibold text-primary">
                        Remote USA
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs leading-relaxed text-foreground">
                        I configure high availability Kubernetes setups, build Terraform provisioning pipelines, and optimize database clustering processes for latency.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {currentThemeData.skills.map((skill) => (
                          <span
                            key={skill}
                            className={cn(
                              "rounded px-2 py-0.5 text-[9px] font-bold border border-border/60 bg-background",
                              selectedTheme === "cyberpunk" && "border-cyan-500/30 text-cyan-400 bg-cyan-950/20"
                            )}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-3 text-[10px] text-muted-foreground">
                    <span>Active Template: {currentThemeData.name}</span>
                    <span className={cn("flex items-center gap-1 font-bold bg-gradient-to-r bg-clip-text text-transparent", currentThemeData.accent)}>
                      Explore Work
                      <ArrowRight className="h-3 w-3 text-primary" />
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Why BuildMyPortfolio */}
      <section className="py-20 lg:py-28 border-b border-border/40 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">The Professional Advantage</h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Why technology leaders choose BuildMyPortfolio over standard site generators.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Recruiter-Approved Schemas</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Designed in collaboration with engineering recruiters. Emphasizes clean projects grid lists, interactive commit calendars, and quick PDF exports.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Sub-Second Load Latency</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Zero page bloating or nested script files. Your static portfolio pre-renders globally via Cloudflare Edge nodes, boosting page performance metrics.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Code className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Continuous Profile Refreshes</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Connect GitHub once. We pull language updates and contribution maps in the background, keeping your content fresh.
                  </p>
                </div>
              </div>
            </div>

            {/* Metric Comparison Card */}
            <div className="rounded-2xl border border-border/50 bg-secondary/5 p-6 space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Lighthouse Performance Statistics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Performance Score</span>
                    <span className="text-green-500">100%</span>
                  </div>
                  <div className="h-2 w-full rounded bg-muted">
                    <div className="h-full w-full rounded bg-green-500" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>SEO Audit Rating</span>
                    <span className="text-green-500">100%</span>
                  </div>
                  <div className="h-2 w-full rounded bg-muted">
                    <div className="h-full w-full rounded bg-green-500" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Accessibility Standards</span>
                    <span className="text-green-500">100%</span>
                  </div>
                  <div className="h-2 w-full rounded bg-muted">
                    <div className="h-full.5 w-full rounded bg-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 border-b border-border/40 bg-secondary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Client &amp; User Feedback</h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Here is what developers and technology builders write about using our website scaffold builder.
            </p>
          </div>

          {loadingTestimonials ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="h-44 rounded-2xl border border-border bg-card animate-pulse" />
              ))}
            </div>
          ) : testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {testimonials.map((test) => (
                <div key={test.id} className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between">
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium italic">
                    &quot;{test.review}&quot;
                  </p>
                  <div className="flex items-center gap-3 mt-6">
                    {test.photoUrl ? (
                      <img src={test.photoUrl} alt={test.clientName} className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                        {test.clientName[0]}
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{test.clientName}</h4>
                      <p className="text-[10px] text-muted-foreground">{test.position} at {test.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Premium Placeholder UI State for Testimonials
            <div className="rounded-2xl border border-dashed border-border p-12 max-w-2xl mx-auto flex flex-col items-center text-center space-y-4 bg-card/20 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Testimonials Coming Soon</h3>
              <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
                We are currently building in public! Real-time developer user reviews and testimonials will appear automatically as our active portfolio creators start deploying and sharing their live websites.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 lg:py-28 border-b border-border/40 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 text-left sm:text-center">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-primary">Simple Pricing Tiers</span>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl mt-1">
              Select Your SaaS Workspace Plan
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Pay once, build lifetime. Fully customized portfolio layouts and advanced AI Gemini copywriting helpers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "rounded-2xl border p-8 flex flex-col justify-between transition-all duration-300 bg-card/35 relative text-left",
                  plan.popular
                    ? "border-primary shadow-xl scale-105 z-10 bg-background"
                    : "border-border/60 hover:border-muted-foreground/30"
                )}
              >
                {plan.popular && (
                  <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1.5 text-[9px] uppercase tracking-wider font-extrabold text-white shadow-md">
                    Most Popular
                  </span>
                )}

                <div>
                  <span className="text-[9px] uppercase tracking-widest font-extrabold text-muted-foreground">{plan.badge}</span>
                  <h3 className="text-lg font-black text-foreground mt-1">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tight text-foreground">{plan.price}</span>
                  </div>
                  <p className="mt-2.5 text-xs text-muted-foreground leading-normal">{plan.desc}</p>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-xs text-foreground">
                        <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Link
                    href="/register"
                    className={cn(
                      "block w-full rounded-xl py-3.5 text-center text-xs font-bold shadow transition-all duration-200 cursor-pointer",
                      plan.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/95 hover:-translate-y-0.5"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/85"
                    )}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Matrix Table */}
          <div className="mt-24 rounded-2xl border border-border/60 bg-card/10 overflow-hidden hidden md:block">
            <div className="p-6 bg-muted/20 border-b border-border/60 text-left">
              <h3 className="text-sm font-bold text-foreground">Detailed Plan Matrix</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Compare features across our Hobby, Pro, and Premium tiers.</p>
            </div>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/10 font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
                  <th className="p-4 w-2/5">Feature Matrix</th>
                  <th className="p-4">Hobby</th>
                  <th className="p-4">Pro</th>
                  <th className="p-4">Premium</th>
                </tr>
              </thead>
              <tbody>
                {matrixCategories.map((cat) => (
                  <tr key={cat.category} className="border-b border-border/40">
                    <td colSpan={4} className="p-4 bg-muted/5 font-extrabold uppercase tracking-wider text-primary text-[10px]">
                      {cat.category}
                    </td>
                  </tr>
                ))}
                {matrixCategories.flatMap(c => c.items).map((item) => (
                  <tr key={item.name} className="border-b border-border/40 hover:bg-muted/10">
                    <td className="p-4 font-semibold text-foreground">{item.name}</td>
                    <td className="p-4 text-muted-foreground">{item.hobby}</td>
                    <td className="p-4 text-foreground font-bold">{item.pro}</td>
                    <td className="p-4 text-foreground font-bold">{item.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 lg:py-28 border-b border-border/40 bg-secondary/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-primary">Knowledge Center</span>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl mt-1">Frequently Asked Questions</h2>
            <p className="mt-4 text-base text-muted-foreground">
              Quick responses about payments, subdomains, AI writing, or security credentials.
            </p>
          </div>

          {/* Search & Filter Header */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-8">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-background pl-10 pr-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>
            <div className="flex gap-2 flex-wrap justify-center text-[10px] font-bold uppercase tracking-wider">
              {["All", "AI", "Themes", "Domains", "Pricing", "Support"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFaqCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border transition-all cursor-pointer",
                    faqCategory === cat
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border/60 text-muted-foreground bg-background hover:bg-muted"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div key={index} className="rounded-xl border border-border bg-background overflow-hidden transition-all duration-200">
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-left font-bold text-xs sm:text-sm hover:bg-muted/30 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={cn("h-4.5 w-4.5 text-muted-foreground transition-transform duration-200", activeFaq === index && "rotate-180 text-primary")} />
                  </button>
                  <AnimatePresence initial={false}>
                    {activeFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="border-t border-border p-5 text-xs leading-relaxed text-muted-foreground bg-muted/10 text-left">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-8 flex flex-col items-center justify-center text-center text-muted-foreground">
                <HelpCircle className="h-8 w-8 mb-2" />
                <p className="text-xs">No matching questions found.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="relative overflow-hidden py-24 bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl opacity-60" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative space-y-8">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl leading-tight">
            Ready to Build Your Developer Website?
          </h2>
          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Join thousands of developers using BuildMyPortfolio to showcase active repositories, map credentials automatically, and launch responsive portfolios to the public edge network.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-xs font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all hover:scale-[1.02] duration-200"
            >
              Start Generating Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-slate-800 bg-slate-900/60 text-white hover:bg-slate-900 px-8 py-4 text-xs font-bold transition-all duration-200"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
