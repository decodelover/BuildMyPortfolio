"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Check, ArrowRight, Shield, Zap } from "lucide-react";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pt-32 pb-24 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold">
            <Sparkles className="w-4 h-4" /> Simple Transparent Pricing
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
            Invest in Your Career Growth
          </h1>
          <p className="text-base text-muted-foreground">
            Start for free and upgrade as your portfolio traffic and custom domain needs expand.
          </p>

          {/* Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3 text-xs font-bold">
            <span className={!isAnnual ? "text-foreground" : "text-muted-foreground"}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-12 items-center rounded-full bg-primary/20 border border-primary/30 p-1"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-primary transition-transform ${
                  isAnnual ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span className={isAnnual ? "text-foreground" : "text-muted-foreground"}>
              Annual <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Tier */}
          <div className="p-8 rounded-3xl border border-border bg-card shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground block">Starter</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-foreground">$0</span>
                <span className="text-xs text-muted-foreground">/ month</span>
              </div>
              <p className="text-xs text-muted-foreground">Perfect for students and early-career developers building their first site.</p>
              <ul className="space-y-2.5 text-xs text-foreground font-medium pt-4 border-t border-border">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 1 Portfolio Website</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Standard Templates</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> `buildmyportfolio.dev` Subdomain</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 1,000 Monthly Visitors</li>
              </ul>
            </div>
            <Link href="/register" className="w-full text-center py-3 rounded-xl border border-border bg-background hover:bg-muted text-xs font-bold">
              Start Building Free
            </Link>
          </div>

          {/* Pro Tier (Featured) */}
          <div className="p-8 rounded-3xl border-2 border-violet-500 bg-card shadow-xl space-y-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-violet-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl">
              Most Popular
            </div>
            <div className="space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-violet-600 block">Pro Creator</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-foreground font-mono">{isAnnual ? "$15" : "$19"}</span>
                <span className="text-xs text-muted-foreground">/ month</span>
              </div>
              <p className="text-xs text-muted-foreground">For senior engineers, designers, and consultants who need custom domains and analytics.</p>
              <ul className="space-y-2.5 text-xs text-foreground font-medium pt-4 border-t border-border">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Up to 5 Active Portfolios</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Custom Domain Support (`yourname.com`)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited AI Generations</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Remove Platform Branding</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Realtime Visitor Analytics</li>
              </ul>
            </div>
            <Link href="/register?plan=pro" className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-xs font-bold shadow-md shadow-violet-500/25">
              Get Pro Access
            </Link>
          </div>

          {/* Business Tier */}
          <div className="p-8 rounded-3xl border border-border bg-card shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground block">Executive / Agency</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-foreground font-mono">{isAnnual ? "$39" : "$49"}</span>
                <span className="text-xs text-muted-foreground">/ month</span>
              </div>
              <p className="text-xs text-muted-foreground">For teams, agencies, and executives needing priority support and custom SLA.</p>
              <ul className="space-y-2.5 text-xs text-foreground font-medium pt-4 border-t border-border">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited Portfolios</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Multiple Custom Domains</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Priority AI Queue Access</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Dedicated Support Agent</li>
              </ul>
            </div>
            <Link href="/contact" className="w-full text-center py-3 rounded-xl border border-border bg-background hover:bg-muted text-xs font-bold">
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
