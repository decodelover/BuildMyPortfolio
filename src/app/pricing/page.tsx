"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { motion } from "framer-motion";
import { Check, HelpCircle, Sparkles, ChevronDown, CheckCircle2, ShoppingCart, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const pricingPlans = [
  {
    name: "FREE",
    price: "$0",
    description: "Perfect for students and developers starting out on their coding journey.",
    features: [
      "1 Generated Portfolio",
      "Standard Templates",
      "Subdomain Hosting (buildmyportfolio.com)",
      "Standard AI Writing Assistance",
      "Ad-supported footer links",
    ],
    cta: "Sign Up Free",
    popular: false,
    badge: "Basic",
  },
  {
    name: "PRO",
    price: "$39",
    period: "One-Time Payment",
    description: "Our most popular package for active job seekers and freelancers.",
    features: [
      "Unlimited Portfolios",
      "All Premium Themes (Cyberpunk, Brutalist, etc.)",
      "Custom Domain Support + Free SSL",
      "Advanced Gemini Writer (Unlimited queries)",
      "Remove branding logo from footers",
      "Standard visitor analytics dashboard",
      "Lifetime updates & templates access",
    ],
    cta: "Get Pro Access",
    popular: true,
    badge: "Most Popular",
  },
  {
    name: "PREMIUM",
    price: "$79",
    period: "One-Time Payment",
    description: "Built for developer agencies, design houses, and power users.",
    features: [
      "Everything in Pro",
      "Multi-user Team Dashboard",
      "Custom HTML/CSS injection controls",
      "White-label client portfolio portals",
      "Priority customer support lines",
      "Automated PDF Resume generator",
      "Unlimited project file export (.zip)",
    ],
    cta: "Claim Elite Tier",
    popular: false,
    badge: "Enterprise",
  },
];

const featuresComparison = [
  { feature: "Generated Portfolios", free: "1 Portfolio", pro: "Unlimited", premium: "Unlimited" },
  { feature: "Themes Selection", free: "Standard Themes", pro: "All Themes", premium: "All Themes + Custom Styles" },
  { feature: "AI Query Limits", free: "5 per day", pro: "Unlimited", premium: "Unlimited" },
  { feature: "Custom Domains Setup", free: "❌", pro: "✅ Free SSL", proCheck: true, premium: "✅ Free SSL + Edge proxy", premiumCheck: true },
  { feature: "Remove Branding", free: "❌", pro: "✅", proCheck: true, premium: "✅", premiumCheck: true },
  { feature: "Export Code (.zip)", free: "❌", pro: "❌ (available as add-on)", premium: "✅ Unlimited" },
  { feature: "White Label Portals", free: "❌", pro: "❌", premium: "✅" },
  { feature: "PDF Resume Generator", free: "❌", pro: "❌", premium: "✅" },
  { feature: "Support Channel", free: "Email support", pro: "Standard Priority", premium: "24/7 Dedicated Support" },
];

const upsellsList = [
  { id: "themes", name: "Theme Packs", price: 15, desc: "Add 5 premium retro cyberpunk & minimalist presets." },
  { id: "resume", name: "Resume Pack", price: 10, desc: "3 templates styled to match your new portfolio." },
  { id: "credits", name: "AI Credits Booster", price: 10, desc: "Extra high-speed Gemini queries for copy refinement." },
  { id: "export", name: "Portfolio Export (.zip)", price: 19, desc: "Download clean React/TypeScript source files." },
  { id: "domain", name: "Custom Domain Setup Assist", price: 15, desc: "Full SSL/DNS integration configuration with support." },
  { id: "templates", name: "Premium Templates Pack", price: 20, desc: "Highly creative layouts for agencies and engineers." },
  { id: "review", name: "Portfolio Review & Audit", price: 29, desc: "Full UI review and recommendations by our staff designer." },
  { id: "badge", name: "Featured Developer Badge", price: 9, desc: "Get promoted on the BuildMyPortfolio directory list." },
  { id: "agency", name: "Agency License", price: 99, desc: "Unlock multi-client visual project sub-accounts." },
];

const pricingFaq = [
  { q: "Is the Pro/Premium price really a one-time charge?", a: "Yes. Once you buy Pro or Premium access, you get lifetime hosting, templates, updates, and unlimited portfolio revisions. No monthly recurring fees." },
  { q: "Can I upgrade from Free to Pro later?", a: "Absolutely. You can log into your account, configure templates under the Free plan, and upgrade to Pro or Premium at any point to unlock custom domains and exports." },
  { q: "Can I host multiple sites under different domains?", a: "Yes. Pro and Premium licenses support unlimited portfolios. You can point a separate domain name to each generated portfolio independently." },
  { q: "How does the Portfolio Export work?", a: "If you purchase the Portfolio Export addon (or have the Premium plan), you can hit 'Download Code' to export your portfolio as a clean, ready-to-run Next.js/Tailwind CSS project repository." },
];

export default function PricingPage() {
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleUpsell = (id: string) => {
    if (selectedUpsells.includes(id)) {
      setSelectedUpsells(selectedUpsells.filter((item) => item !== id));
    } else {
      setSelectedUpsells([...selectedUpsells, id]);
    }
  };

  const calculateTotalPrice = () => {
    const upsellCost = selectedUpsells.reduce((acc, curr) => {
      const match = upsellsList.find((u) => u.id === curr);
      return acc + (match ? match.price : 0);
    }, 0);
    return upsellCost;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Header section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-24 lg:pb-20 border-b border-border bg-gradient-to-b from-background to-secondary/10">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-12 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-24 right-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary"
          >
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
            Simple Transparent Pricing
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground"
          >
            Pay Once. Use Forever.
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              No Monthly Subscriptions.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Pick a tier designed to fit your developer needs. Save hundreds of dollars compared to recurring portfolio hosting packages.
          </motion.p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={cn(
                  "rounded-2xl border p-8 flex flex-col justify-between transition-all duration-300 bg-card/45 backdrop-blur-sm relative",
                  plan.popular
                    ? "border-primary shadow-xl md:scale-105 z-10 bg-background"
                    : "border-border hover:border-primary/40 hover:-translate-y-1"
                )}
              >
                {plan.popular && (
                  <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1 text-xs font-bold text-white shadow-md uppercase tracking-wider">
                    {plan.badge}
                  </span>
                )}

                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                    {!plan.popular && (
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground uppercase">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold tracking-tight text-foreground">{plan.price}</span>
                    {plan.period && (
                      <span className="text-xs font-semibold text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 text-sm text-foreground">
                        <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Link
                    href="/register"
                    className={cn(
                      "block w-full rounded-xl py-3.5 text-center text-sm font-semibold shadow transition-all duration-200",
                      plan.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/95 hover:-translate-y-0.5"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    )}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-20 border-t border-border bg-secondary/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Full Plan Feature Comparison</h2>
            <p className="text-sm text-muted-foreground mt-2">Check the breakdown of what is included in each option.</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="p-5">Feature</th>
                  <th className="p-5">Free</th>
                  <th className="p-5 text-primary">Pro</th>
                  <th className="p-5">Premium</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-border">
                {featuresComparison.map((row) => (
                  <tr key={row.feature} className="hover:bg-muted/10 transition-colors">
                    <td className="p-5 font-medium text-foreground">{row.feature}</td>
                    <td className="p-5 text-muted-foreground">{row.free}</td>
                    <td className="p-5 text-primary font-semibold">
                      {row.pro === "✅" || row.pro === "❌" ? (
                        row.proCheck ? <Check className="h-5 w-5 text-primary" /> : "❌"
                      ) : row.pro}
                    </td>
                    <td className="p-5 text-foreground font-semibold">
                      {row.premium === "✅" || row.premium === "❌" ? (
                        row.premiumCheck ? <Check className="h-5 w-5 text-foreground" /> : "❌"
                      ) : row.premium}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Upsells section */}
      <section className="py-20 bg-background border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Need a custom stack? Add-on services</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Select only the items you need to customize your developer package without paying for a full pricing upgrade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upsellsList.map((item) => {
              const isSelected = selectedUpsells.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleUpsell(item.id)}
                  className={cn(
                    "flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-all duration-200 select-none",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md scale-[1.01]"
                      : "border-border hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className={cn(
                      "flex h-5 w-5 items-center justify-center rounded border transition-colors",
                      isSelected ? "bg-primary border-primary text-primary-foreground" : "border-border bg-background"
                    )}>
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{item.name}</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-foreground px-3 py-1 bg-secondary rounded-lg border border-border">
                    +${item.price}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Calculate dynamic card */}
          {selectedUpsells.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 to-accent/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-left"
            >
              <div>
                <h4 className="text-base font-bold text-foreground">Custom Package Total</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Selected add-ons: {selectedUpsells.map((id) => upsellsList.find((u) => u.id === id)?.name).join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-black text-foreground">${calculateTotalPrice()}</span>
                <Link
                  href="/register"
                  className="rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-colors"
                >
                  Checkout Custom Package
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Pricing FAQs */}
      <section className="py-20 bg-secondary/10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Pricing FAQ</h2>
            <p className="text-sm text-muted-foreground mt-2">Answers to common billing questions.</p>
          </div>

          <div className="space-y-4">
            {pricingFaq.map((faq, index) => (
              <div key={index} className="rounded-xl border border-border bg-background overflow-hidden transition-all duration-200">
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-left font-bold text-base hover:bg-muted/30 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform duration-200", activeFaq === index && "rotate-180 text-primary")} />
                </button>
                {activeFaq === index && (
                  <div className="border-t border-border p-5 text-sm leading-relaxed text-muted-foreground bg-muted/10">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
