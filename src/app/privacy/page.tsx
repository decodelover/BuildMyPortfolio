"use client";

import React from "react";
import { ShieldCheck, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pt-32 pb-24 text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" /> Legal &amp; Privacy
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground">Privacy Policy</h1>
          <p className="text-xs text-muted-foreground">Last updated: July 23, 2026</p>
        </div>

        <div className="p-8 rounded-3xl border border-border bg-card shadow-sm space-y-6 text-xs leading-relaxed text-muted-foreground">
          <section className="space-y-2">
            <h3 className="text-base font-bold text-foreground">1. Data Collection &amp; Use</h3>
            <p>
              BuildMyPortfolio collects information you provide directly, such as your email address, name, portfolio descriptions, and uploaded images. We use this data strictly to render your portfolio websites and process subscription payments.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-foreground">2. Data Isolation &amp; Security</h3>
            <p>
              Your portfolio data is stored in isolated Firestore databases protected by strict security rules. We do not sell your personal data or trade user analytics to third-party advertisers.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-foreground">3. Cookies &amp; Local Storage</h3>
            <p>
              We use essential session cookies for Firebase authentication and preference storage (such as light/dark mode selection).
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-foreground">4. Contact Us</h3>
            <p>
              If you have any questions regarding this Privacy Policy or wish to request data deletion, contact us at <a href="mailto:privacy@buildmyportfolio.dev" className="text-violet-600 font-bold">privacy@buildmyportfolio.dev</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
