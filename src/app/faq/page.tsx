"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { ChevronDown, Search, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const faqsList = [
  {
    category: "AI",
    q: "How does the Google Gemini AI builder assemble my portfolio?",
    a: "Google Gemini takes your work highlights, years of experience, and project descriptions, structures them into schema objects, synthesizes copy, and applies responsive theme styling.",
  },
  {
    category: "Themes",
    q: "Can I switch layout themes after generating my website?",
    a: "Yes. Content is independent of themes. You can switch between Minimalist, Cyberpunk, Brutalist, and Creative layouts instantly in your workspace.",
  },
  {
    category: "Domains",
    q: "Can I connect my own custom domains?",
    a: "Yes. All Pro and Business plans support custom domain integration with automated SSL provisioning.",
  },
  {
    category: "Hosting",
    q: "Are SSL certificates included?",
    a: "Yes. Free automated SSL certificates are issued for both custom domains and subdomains.",
  },
  {
    category: "Pricing",
    q: "Can I upgrade or cancel anytime?",
    a: "Yes. You can upgrade, downgrade, or cancel your subscription at any time without fees.",
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const filteredFaqs = faqsList.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 text-left">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-wider">
              Help Center &amp; FAQ
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
              Frequently Asked Questions
            </h1>
            <p className="text-xs sm:text-base text-muted-foreground font-medium leading-relaxed">
              Quick answers to common questions about domain mapping, themes, and AI features.
            </p>

            {/* Search Input */}
            <div className="relative max-w-md mx-auto pt-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full rounded-2xl border border-border/60 bg-card/80 pl-10 pr-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary/45 shadow-sm"
              />
            </div>
          </div>

          {/* Accordion list */}
          <div className="space-y-3">
            {filteredFaqs.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border/60 bg-card/70 p-5 cursor-pointer shadow-xs backdrop-blur-2xl"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div className="flex items-center justify-between font-extrabold text-sm text-foreground">
                  <span>{item.q}</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", activeFaq === idx && "rotate-180")} />
                </div>
                {activeFaq === idx && (
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed pt-3 border-t border-border/40 font-medium">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
