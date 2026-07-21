"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Sparkles, CheckCircle2, ShieldCheck, HelpCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const pricingPlans = [
    {
      id: "free",
      name: "FREE STARTER",
      monthlyPrice: "$0",
      yearlyPrice: "$0",
      period: "Forever Free",
      description: "Perfect for students and early stage developers starting their coding journey.",
      features: [
        "1 Active Portfolio Website",
        "Subdomain hosting (name.buildmyportfolio.com)",
        "Standard AI Copywriting Credits (500/mo)",
        "Standard Minimalist Theme",
        "Community Support",
      ],
      cta: "Sign Up Free",
      popular: false,
    },
    {
      id: "pro",
      name: "PROFESSIONAL PRO",
      monthlyPrice: "$39",
      yearlyPrice: "$31",
      period: "Billed Annually",
      description: "Our recommended plan for professional developers, designers, and active job seekers.",
      features: [
        "5 Active Published Portfolios",
        "Custom Domain Support + Free SSL",
        "2,500 Monthly AI Copy Credits",
        "Import PDF Resume & Sync GitHub",
        "Remove BuildMyPortfolio Branding",
        "Automated Quality Assurance Scans",
        "Traffic Analytics Dashboard",
      ],
      cta: "Start 14-Day Free Trial",
      popular: true,
      badge: "Most Popular",
    },
    {
      id: "business",
      name: "PREMIUM BUSINESS",
      monthlyPrice: "$79",
      yearlyPrice: "$63",
      period: "Billed Annually",
      description: "Built for developer agencies, design houses, and contractors.",
      features: [
        "Unlimited Published Portfolios",
        "Unlimited Custom Domains",
        "10,000 Monthly AI Credits",
        "Export Clean Next.js React Code (.zip)",
        "White-label Client Admin Portals",
        "24/7 Dedicated Support & Custom SLAs",
      ],
      cta: "Get Business Access",
      popular: false,
    },
  ];

  const pricingFaq = [
    { q: "Can I use my own custom domain name?", a: "Yes! Professional and Business plans support custom domain mapping with automatic SSL certificate provisioning." },
    { q: "Can I export my portfolio source code?", a: "Yes. Business plan subscribers can export their compiled portfolio as a clean, ready-to-deploy Next.js 15 React codebase." },
    { q: "Is there a money-back guarantee?", a: "We offer a 14-day 100% money-back guarantee on all paid plans. No questions asked." },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 text-left">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-wider">
              Transparent Enterprise Pricing
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
              Simple Plans for Every Stage of Your Career
            </h1>
            <p className="text-xs sm:text-base text-muted-foreground font-medium leading-relaxed">
              No hidden fees. Upgrade, downgrade, or cancel at any time.
            </p>

            {/* Monthly / Yearly Billing Toggle */}
            <div className="pt-4 flex items-center justify-center gap-3 text-xs font-bold">
              <span className={billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"}>Monthly</span>
              <button
                type="button"
                onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                className="w-12 h-6 rounded-full bg-muted p-1 border border-border relative transition-colors cursor-pointer"
              >
                <motion.div
                  animate={{ x: billingCycle === "yearly" ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="h-4 w-4 rounded-full bg-primary"
                />
              </button>
              <span className={billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground"}>
                Annual <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Save 20%</span>
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((p) => {
              const price = billingCycle === "yearly" ? p.yearlyPrice : p.monthlyPrice;
              return (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "rounded-3xl border p-8 shadow-sm backdrop-blur-2xl space-y-6 flex flex-col justify-between transition-all relative overflow-hidden text-left",
                    p.popular
                      ? "border-primary/50 bg-gradient-to-b from-card via-card to-primary/5 shadow-xl scale-105"
                      : "border-border/60 bg-card/70"
                  )}
                >
                  {p.popular && (
                    <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-primary text-primary-foreground shadow-xs">
                      {p.badge}
                    </span>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-foreground">{p.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.description}</p>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-foreground">{price}</span>
                      <span className="text-xs text-muted-foreground font-semibold">/ month</span>
                    </div>

                    <ul className="space-y-3 text-xs text-muted-foreground font-medium border-t border-border/40 pt-4">
                      {p.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href="/register"
                    className={cn(
                      "w-full py-3.5 rounded-2xl font-extrabold text-xs text-center shadow-md transition-all cursor-pointer block",
                      p.popular
                        ? "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-95"
                        : "bg-primary text-primary-foreground hover:opacity-90"
                    )}
                  >
                    {p.cta}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Pricing FAQ Section */}
          <div className="max-w-3xl mx-auto space-y-6">
            <h3 className="text-2xl font-extrabold text-foreground text-center">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {pricingFaq.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/60 bg-card/70 p-4 cursor-pointer"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                >
                  <div className="flex items-center justify-between font-bold text-xs text-foreground">
                    <span>{item.q}</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", activeFaq === idx && "rotate-180")} />
                  </div>
                  {activeFaq === idx && (
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed pt-2 border-t border-border/40">
                      {item.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
