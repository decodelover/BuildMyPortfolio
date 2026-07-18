"use client";

import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Privacy Policy</h1>
          <p className="text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Policy details */}
      <section className="py-16 bg-background text-left">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-xs leading-relaxed text-muted-foreground">
            
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground">1. Introduction</h3>
              <p>
                Welcome to BuildMyPortfolio (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We respect your privacy and are committed to protecting your personal data. This privacy policy describes how we collect, store, share, and use the information you provide when using our SaaS platform at buildmyportfolio.com.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground">2. Information We Collect</h3>
              <p>We collect information you provide directly to us, including:</p>
              <ul className="list-disc pl-5 space-y-1.5 font-medium">
                <li><strong>Account Registration</strong>: Name, email address, profile photo url, and authentication credentials.</li>
                <li><strong>Developer Data</strong>: Professional experience dates, project descriptions, skills keywords, and links to your GitHub/LinkedIn profiles.</li>
                <li><strong>Contact details</strong>: Information submitted via our contact and ticket forms.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground">3. How We Use Your Information</h3>
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-1.5 font-medium">
                <li>To generate and host your customized developer portfolio websites.</li>
                <li>To synchronize data (e.g. repositories, commits) from external integrations like GitHub.</li>
                <li>To refine portfolio descriptions and content writing using the Google Gemini API.</li>
                <li>To provide technical client support and security monitoring.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground">4. Third-Party Integrations</h3>
              <p>
                Our service allows you to link your portfolio to third-party services like GitHub, LinkedIn, and custom domain gateways. When you link these services, we collect user details under the authorization scopes you consent to. Please review the respective privacy policies of these third parties.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground">5. Data Retention &amp; Deletion</h3>
              <p>
                We retain your account profile and generated portfolio data as long as your account is active. You can delete your portfolio or account at any time from your settings panel. Account deletion immediately removes all personal data documents from our primary active databases.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground">6. Security</h3>
              <p>
                We protect client data using industry-standard security protocols. All database communication is encrypted using TLS/SSL, and customer credentials are authenticated securely via Firebase Identity services. However, no data transmission is completely secure, and we cannot guarantee absolute data protection.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground">7. Contact Us</h3>
              <p>
                If you have any questions or feedback regarding this Privacy Policy, please open a support ticket on our <a href="/contact" className="text-primary hover:underline font-bold">Contact Page</a> or write to support@buildmyportfolio.com.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
