"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Target, Shield, Heart, Users, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pt-32 pb-24 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold">
            <Sparkles className="w-4 h-4" /> About BuildMyPortfolio
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
            Our Mission: Empower Every Creator with a World-Class Digital Presence
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            BuildMyPortfolio was created with a simple belief: every software engineer, designer, product manager, and founder deserves a personal website that highlights their craft without requiring weeks of tedious coding.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl border border-border bg-card shadow-sm space-y-3">
            <Target className="w-8 h-8 text-violet-600" />
            <h3 className="text-lg font-bold text-foreground">Design Perfection</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We obsess over typography, spacing, micro-interactions, and visual hierarchy so your portfolio looks handcrafted by a principal design team.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-border bg-card shadow-sm space-y-3">
            <Shield className="w-8 h-8 text-cyan-600" />
            <h3 className="text-lg font-bold text-foreground">Enterprise Security</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Built on enterprise-grade infrastructure with Firebase, Cloudflare CDN, and automated SSL certificate validation.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-border bg-card shadow-sm space-y-3">
            <Heart className="w-8 h-8 text-rose-600" />
            <h3 className="text-lg font-bold text-foreground">Creator First</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Zero lock-in. Export your portfolio data, custom domain, or static HTML anytime with a single click.
            </p>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="p-10 rounded-3xl border border-border bg-card/60 backdrop-blur-md grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-black text-foreground font-mono">180+</p>
            <p className="text-xs text-muted-foreground">Countries Reached</p>
          </div>
          <div>
            <p className="text-3xl font-black text-violet-600 font-mono">50,000+</p>
            <p className="text-xs text-muted-foreground">Portfolios Built</p>
          </div>
          <div>
            <p className="text-3xl font-black text-cyan-600 font-mono">1.2s</p>
            <p className="text-xs text-muted-foreground">Avg Compile Time</p>
          </div>
          <div>
            <p className="text-3xl font-black text-emerald-600 font-mono">99.99%</p>
            <p className="text-xs text-muted-foreground">SLA Uptime</p>
          </div>
        </div>
      </div>
    </div>
  );
}
