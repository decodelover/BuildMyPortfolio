"use client";

import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsPage() {
  const lastUpdated = "July 18, 2026";

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
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20"
          >
            <Shield className="h-4.5 w-4.5" />
          </motion.div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Terms of Service</h1>
          <p className="text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Terms details */}
      <section className="py-16 bg-background text-left">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-xs leading-relaxed text-muted-foreground">
            
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground">1. Agreement to Terms</h3>
              <p>
                By creating an account, accessing, or using the BuildMyPortfolio website and visual editor tools, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, you must not access or use our services.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground">2. Accounts &amp; Access</h3>
              <p>
                When creating an account, you must provide accurate, current, and complete registration information. You are solely responsible for protecting the confidentiality of your credentials and account sessions. You agree to immediately notify us of any unauthorized account access.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground">3. Services &amp; Portfolios Content</h3>
              <ul className="list-disc pl-5 space-y-1.5 font-medium">
                <li>You retain all ownership rights to the profile details, summaries, and projects text you upload or import.</li>
                <li>By creating a public portfolio, you grant us a worldwide license to host, display, and distribute your portfolio content on the web.</li>
                <li>You agree not to publish any malicious code, defamatory summaries, copyright-infringing assets, or spam portfolios. We reserve the right to suspend any account violating these rules.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground">4. One-Time Purchases &amp; Add-ons</h3>
              <p>
                Certain features (like Pro, Premium, or Theme/Export Add-ons) require one-time fees. All prices are stated in USD. All one-time license fees are governed by our 14-day refund guarantee policy. We reserve the right to modify template bundles or pricing scopes at any time.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground">5. Disclaimer of Warranties</h3>
              <p>
                Our services, templates, and AI writing assistants are provided &quot;as is&quot; without warranties of any kind. We do not guarantee that generated portfolios will score perfectly under all performance audits or that hosting services will be uninterrupted.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground">6. Limitation of Liability</h3>
              <p>
                To the maximum extent permitted by law, BuildMyPortfolio shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of, or inability to use, our service platforms or templates.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground">7. Governing Law</h3>
              <p>
                These Terms of Service shall be governed by and construed in accordance with the laws of the State of California, without regard to conflict of law principles.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
