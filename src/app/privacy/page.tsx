"use client";

import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  const lastUpdated = "July 17, 2026";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden pt-16 pb-12 lg:pt-20 lg:pb-16 border-b border-border bg-gradient-to-b from-background to-secondary/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Shield className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Privacy Policy</h1>
          <p className="text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-16 bg-background text-left">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
            
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">1. Introduction</h3>
              <p>
                Welcome to BuildMyPortfolio (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We respect your privacy and are committed to protecting your personal data. This privacy policy describes how we collect, store, share, and use the information you provide when using our SaaS platform at buildmyportfolio.com.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">2. Information We Collect</h3>
              <p>We collect information you provide directly to us, including:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Account Registration</strong>: Name, email address, profile photo url, and authentication credentials.</li>
                <li><strong>Developer Data</strong>: Professional experience dates, project descriptions, skills keywords, and links to your GitHub/LinkedIn profiles.</li>
                <li><strong>Contact details</strong>: Information submitted via our contact and ticket forms.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">3. How We Use Your Information</h3>
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>To generate and host your customized developer portfolio websites.</li>
                <li>To synchronize data (e.g. repositories, commits) from external integrations like GitHub.</li>
                <li>To refine portfolio descriptions and content writing using the Google Gemini API.</li>
                <li>To provide technical client support and security monitoring.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">4. Third-Party Integrations</h3>
              <p>
                Our service allows you to link your portfolio to third-party services like GitHub, LinkedIn, and custom domain gateways. When you link these services, we collect user details under the authorization scopes you consent to. Please review the respective privacy policies of these third parties.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">5. Data Retention &amp; Deletion</h3>
              <p>
                We retain your account profile and generated portfolio data as long as your account is active. You can delete your portfolio or account at any time from your settings panel. Account deletion immediately removes all personal data documents from our primary active databases.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">6. Security</h3>
              <p>
                We protect client data using industry-standard security protocols. All database communication is encrypted using TLS/SSL, and customer credentials are authenticated securely via Firebase Identity services. However, no data transmission is completely secure, and we cannot guarantee absolute data protection.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">7. Contact Us</h3>
              <p>
                If you have any questions or feedback regarding this Privacy Policy, please open a support ticket on our <a href="/contact" className="text-primary hover:underline">Contact Page</a> or write to support@buildmyportfolio.com.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
