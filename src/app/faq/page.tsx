"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageSquare, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const faqCategories = ["All", "Account & Onboarding", "Builder & Templates", "Domains & Hosting", "Pricing & Billing"];

const faqsList = [
  {
    category: "Account & Onboarding",
    q: "How do I create a portfolio?",
    a: "After registering, you can input your professional experience or parse your resume. Select a theme, customize the style elements, and hit publish. Our builder takes care of generating a responsive layout automatically.",
  },
  {
    category: "Account & Onboarding",
    q: "Can I connect my LinkedIn or GitHub?",
    a: "Yes. In your dashboard, you can connect your GitHub account to import repositories and contribution activity graphs. You can also sync LinkedIn profiles to load work history directly.",
  },
  {
    category: "Builder & Templates",
    q: "Can I change themes after my portfolio is built?",
    a: "Yes. Your text details and theme preferences are separate. You can toggle between Minimalist, Cyberpunk, and Brutalist themes anytime without losing your profile information.",
  },
  {
    category: "Builder & Templates",
    q: "Can I edit the code directly?",
    a: "Our Premium plan allows you to download clean React/TypeScript and Tailwind CSS code files (.zip). You can also inject custom HTML/CSS stylesheet properties in the editor settings panel.",
  },
  {
    category: "Domains & Hosting",
    q: "Where is my portfolio hosted?",
    a: "Every portfolio is hosted on our secure, CDN edge network. Free plans get a default subdomain (yourname.buildmyportfolio.com). Pro and Premium accounts can link custom domains.",
  },
  {
    category: "Domains & Hosting",
    q: "Are the custom domain SSL certificates free?",
    a: "Yes. We configure and renew SSL/TLS encryption certificates automatically for all linked custom domains using our Cloudflare edge rules.",
  },
  {
    category: "Pricing & Billing",
    q: "What is your refund policy?",
    a: "We offer a 14-day money-back guarantee. If you are not fully satisfied with your Pro or Premium purchase, contact support and we will issue a full refund immediately.",
  },
  {
    category: "Pricing & Billing",
    q: "Are there any recurring hosting costs?",
    a: "No. Our Pro and Premium plans are one-time payments for life. We host your portfolio forever on our serverless edge node setup with no extra fees.",
  },
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const filteredFaqs = faqsList.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            <HelpCircle className="h-4 w-4 text-accent animate-pulse" />
            Support Center
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground"
          >
            Frequently Asked Questions
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Got questions about DNS configuration, themes, or how our AI writes copy? Search our documentation registry.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto max-w-md relative mt-4"
          >
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search questions, settings, dns..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveFaq(null);
              }}
              className="w-full rounded-xl border border-border bg-background/85 px-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary shadow-md backdrop-blur-md transition-all"
            />
          </motion.div>
        </div>
      </section>

      {/* Accordion area */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          {/* Category Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-border pb-6">
            {faqCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveFaq(null);
                }}
                className={cn(
                  "rounded-lg border px-4 py-2 text-xs font-semibold transition-all",
                  selectedCategory === cat
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:bg-muted text-muted-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="space-y-4 max-w-3xl mx-auto min-h-[250px]">
            <AnimatePresence mode="popLayout">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, idx) => {
                  const isActive = activeFaq === idx;
                  return (
                    <motion.div
                      key={faq.q}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="rounded-xl border border-border bg-card/60 backdrop-blur-md overflow-hidden transition-all duration-200"
                    >
                      <button
                        onClick={() => setActiveFaq(isActive ? null : idx)}
                        className="flex w-full items-center justify-between p-5 text-left font-bold text-base hover:bg-muted/30 transition-colors"
                      >
                        <span className="text-foreground">{faq.q}</span>
                        <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform duration-200", isActive && "rotate-180 text-primary")} />
                      </button>
                      
                      {isActive && (
                        <div className="border-t border-border p-5 text-sm leading-relaxed text-muted-foreground bg-muted/10">
                          {faq.a}
                        </div>
                      )}
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-muted-foreground space-y-2">
                  <HelpCircle className="h-10 w-10 mx-auto opacity-35" />
                  <p className="text-sm font-semibold">No questions match your search query.</p>
                  <p className="text-xs">Try searching for other keywords like &quot;hosting&quot; or &quot;sync&quot;.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="py-20 text-center relative overflow-hidden bg-secondary">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] opacity-10" />
        
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 relative space-y-6">
          <MessageSquare className="h-10 w-10 mx-auto text-accent" />
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Still have questions?</h2>
          <p className="text-sm text-slate-300">
            If you cannot find the answer to your question in our FAQ list, reach out to our customer support desk directly.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white shadow hover:bg-primary/95 transition-colors"
            >
              Contact Support Ticket
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
