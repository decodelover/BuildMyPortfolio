"use client";

import React from "react";
import { FileText, ShieldCheck } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pt-32 pb-24 text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold">
            <FileText className="w-4 h-4" /> Legal Terms
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground">Terms of Service</h1>
          <p className="text-xs text-muted-foreground">Last updated: July 23, 2026</p>
        </div>

        <div className="p-8 rounded-3xl border border-border bg-card shadow-sm space-y-6 text-xs leading-relaxed text-muted-foreground">
          <section className="space-y-2">
            <h3 className="text-base font-bold text-foreground">1. Agreement to Terms</h3>
            <p>
              By accessing or using BuildMyPortfolio, you agree to be bound by these Terms of Service. If you do not agree, you must discontinue platform usage immediately.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-foreground">2. Content Ownership</h3>
            <p>
              You retain 100% ownership of all portfolio content, images, text, and domain assets you publish using our platform. BuildMyPortfolio claims no intellectual property rights over your content.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-foreground">3. Acceptable Use</h3>
            <p>
              You agree not to publish illegal, abusive, defamatory, or malicious code. We reserve the right to suspend portfolios violating our community guidelines.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-foreground">4. Termination</h3>
            <p>
              You may cancel your subscription or delete your account at any time via your dashboard settings.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
