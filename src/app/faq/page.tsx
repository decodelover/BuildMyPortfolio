"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Search, MessageSquare, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const faqCategories = ["All", "Pricing", "Publishing", "Hosting", "AI", "Themes", "Support", "Payments", "Domains"];

const faqsList = [
  {
    category: "AI",
    q: "How does the Google Gemini AI builder assemble my portfolio?",
    a: "Google Gemini takes your work highlights, years of experience, and project descriptions, structures them into optimized schema structures, synthesizes professional copywriting bios, and suggests a layout optimized to capture the interest of engineering recruiters.",
  },
  {
    category: "Themes",
    q: "Can I switch layout themes after generating my website?",
    a: "Yes. Your written database profile details are independent of the layouts. You can toggle between Minimalist, Neon Cyberpunk, Stark Brutalist, and Luxury presets in your editor dashboard instantly.",
  },
  {
    category: "Domains",
    q: "Can I connect my own custom domains?",
    a: "Yes. All Pro and Premium plans support custom domain integration. We provide instructions for pointing your DNS record fields (A or CNAME) to our servers.",
  },
  {
    category: "Hosting",
    q: "Are linked domain SSL certificates free?",
    a: "Yes. SSL certificates are provisioned and renewed automatically for all active subdomains and linked custom domains securely through Cloudflare Edge gateways.",
  },
  {
    category: "Pricing",
    q: "Is the Pro checkout plan really a one-time payment?",
    a: "Yes. We offer standard one-time payments for both Pro and Premium workspace plans. Pay once and receive lifetime hosting and builder upgrades without recurring monthly fees.",
  },
  {
    category: "Payments",
    q: "Which payment gateways do you support?",
    a: "We support secure global checkouts using Stripe, Paystack, and Flutterwave. All credit cards and mobile money transactions are securely processed via SSL.",
  },
  {
    category: "Support",
    q: "What support channels do you offer for draft adjustments?",
    a: "Hobby users receive basic email troubleshooting. Pro plans unlock priority email queueing, and Premium unlocks 24/7 slack developer support channels.",
  },
  {
    category: "Publishing",
    q: "How fast do design updates sync to the live site?",
    a: "Instantly. When you make edits or upload assets in your editor dashboard and hit 'Publish', all changes propagate globally across Cloudflare edge nodes in seconds.",
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
            <HelpCircle className="h-3.5 w-3.5 text-accent animate-pulse" />
            Support Center
          </motion.div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h1>

          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Find quick answers about pricing plans, custom domain mappings, hosting speeds, and Google Gemini capabilities.
          </p>
        </div>
      </section>

      {/* Content grid */}
      <section className="py-16 bg-background flex-1 text-left">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Search Box */}
          <div className="relative mb-10 max-w-md mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search support answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-background pl-10 pr-4 py-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/45"
            />
          </div>

          {/* Category Filter Header */}
          <div className="flex justify-center gap-2 overflow-x-auto pb-4 mb-10 text-[9px] font-extrabold uppercase tracking-wider select-none">
            {faqCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap",
                  selectedCategory === cat
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border/60 text-muted-foreground bg-background hover:bg-muted"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion Questions */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div key={index} className="rounded-xl border border-border bg-card/15 overflow-hidden transition-all duration-200">
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
                        <div className="border-t border-border p-5 text-xs leading-relaxed text-muted-foreground bg-muted/10">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground max-w-sm mx-auto flex flex-col items-center">
                <HelpCircle className="h-8 w-8 mb-2" />
                <p className="text-xs">No matching questions found.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 text-center relative overflow-hidden bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] opacity-80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-primary/10 blur-3xl opacity-60" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative space-y-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-2 border border-primary/20">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Still have questions?
          </h2>
          <p className="mx-auto max-w-xl text-zinc-400 text-xs leading-relaxed">
            Our support engineers are ready to help you map custom domains or configure GitHub sync. Reach out to our team directly.
          </p>
          <div className="pt-4 flex justify-center">
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-primary/95 transition-all duration-200"
            >
              Contact Support Team
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
