"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HelpCircle, Search, ChevronDown, Sparkles, ArrowRight } from "lucide-react";

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does the AI Portfolio Generator work?",
      a: "Our AI AST engine parses your text prompts, resume bullet points, or GitHub profile. It generates a structured layout AST blueprint and populates modern theme components automatically in seconds.",
    },
    {
      q: "Can I connect my own custom domain?",
      a: "Yes! Pro and Business subscribers can connect any custom domain (e.g. `yourname.com`). SSL certificates are automatically provisioned and managed for free via Cloudflare Edge.",
    },
    {
      q: "Can I export my portfolio data or HTML?",
      a: "Absolutely. BuildMyPortfolio gives you 100% data ownership. You can export your portfolio content as JSON, markdown, static HTML/CSS, or an ATS-friendly PDF resume anytime.",
    },
    {
      q: "Is there a free plan available?",
      a: "Yes! Our Free Starter tier allows you to build and host 1 portfolio website on our `buildmyportfolio.dev` subdomain with zero cost.",
    },
    {
      q: "What payment methods do you support?",
      a: "We support major credit cards, debit cards, Apple Pay, Google Pay, and Paystack for international payments.",
    },
  ];

  const filtered = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pt-32 pb-24 text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold">
            <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
            Everything You Need to Know
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Find quick answers about AI generation, custom domains, pricing, and export options.
          </p>

          <div className="pt-4 max-w-md mx-auto relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search FAQ questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-4">
          {filtered.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3 text-xs">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between font-bold text-sm text-foreground text-left"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180 text-violet-600" : "text-muted-foreground"}`} />
                </button>

                {isOpen && (
                  <p className="text-muted-foreground leading-relaxed pt-2 border-t border-border/60 animate-in fade-in duration-200">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-8 rounded-3xl bg-muted/30 border border-border text-center space-y-3">
          <h3 className="font-bold text-foreground text-base">Still Have Questions?</h3>
          <p className="text-xs text-muted-foreground">Our support team is ready to assist you anytime.</p>
          <Link href="/contact" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs">
            Contact Support <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
