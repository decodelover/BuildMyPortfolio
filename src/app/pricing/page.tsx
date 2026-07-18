"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Sparkles, Plus, AlertCircle, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

const pricingPlans = [
  {
    name: "FREE STARTER",
    price: "$0",
    description: "Perfect for students and early stage developers starting their coding journey.",
    features: [
      "1 Active Portfolio Website",
      "Subdomain hosting (name.buildmyportfolio.com)",
      "Standard AI Writing Assistance",
      "Standard templates access",
      "Default branding banner in footer",
    ],
    cta: "Sign Up Free",
    popular: false,
    badge: "Basic",
  },
  {
    name: "PROFESSIONAL PRO",
    price: "$39",
    period: "One-Time Payment",
    description: "Our recommended plan for developers, designers, and active job seekers.",
    features: [
      "Unlimited Active Portfolios",
      "Custom Domain Support + Free SSL",
      "Advanced Gemini Writer (unlimited queries)",
      "Import PDF Resume & Sync GitHub",
      "Remove branding logo from footers",
      "Traffic Analytics Dashboard",
      "Lifetime updates & templates access",
    ],
    cta: "Get Pro Access",
    popular: true,
    badge: "Most Popular",
  },
  {
    name: "PREMIUM AGENCY",
    price: "$79",
    period: "One-Time Payment",
    description: "Built for developer agencies, design houses, and contractors.",
    features: [
      "Everything in Pro Plan",
      "White label client portfolio portals",
      "Custom CSS/JS injection controls",
      "Version history revisions log",
      "Priority customer support lines",
      "Automated PDF Resume generator",
      "Unlimited project source export (.zip)",
    ],
    cta: "Claim Premium Tier",
    popular: false,
    badge: "Enterprise",
  },
];

const featuresComparison = [
  { feature: "Active Portfolios", free: "1", pro: "Unlimited", premium: "Unlimited" },
  { feature: "Themes Selection", free: "Standard Themes", pro: "All Themes", premium: "All Themes + Custom Styles" },
  { feature: "AI Query Limits", free: "5 per day", pro: "Unlimited", premium: "Unlimited" },
  { feature: "Custom Domains Setup", free: "❌", pro: "✅ Free SSL", premium: "✅ Free SSL + Edge proxy" },
  { feature: "Remove Branding", free: "❌", pro: "✅", premium: "✅" },
  { feature: "Export Code (.zip)", free: "❌", pro: "❌ (available as add-on)", premium: "✅ Unlimited" },
  { feature: "White Label Portals", free: "❌", pro: "❌", premium: "✅" },
  { feature: "PDF Resume Generator", free: "❌", pro: "❌", premium: "✅" },
  { feature: "Support Channel", free: "Email support", pro: "Standard Priority", premium: "24/7 Dedicated Support" },
];

const upsellsList = [
  { id: "themes", name: "Theme Packs Addon", price: 15, desc: "Add 5 premium retro cyberpunk & minimalist presets." },
  { id: "resume", name: "Resume Templates Pack", price: 10, desc: "3 templates styled to match your new portfolio." },
  { id: "credits", name: "AI Credits Booster", price: 10, desc: "Extra high-speed Gemini queries for copy refinement." },
  { id: "export", name: "Portfolio Export (.zip)", price: 19, desc: "Download clean React/TypeScript source files." },
  { id: "domain", name: "Custom Domain Setup Assist", price: 15, desc: "Full SSL/DNS integration configuration with support." },
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

  const calculatedProTotal = 39 + selectedUpsells.reduce((acc, currentId) => {
    const upsell = upsellsList.find((u) => u.id === currentId);
    return acc + (upsell ? upsell.price : 0);
  }, 0);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Header section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-24 lg:pb-20 border-b border-border/40 bg-secondary/5">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-[9px] uppercase tracking-widest font-extrabold text-primary">SaaS Plans</span>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Clear Pricing. Lifetime Access.</h1>
          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Unlock advanced AI copywriting assistance, custom DNS setups, theme variations, and export capabilities.
          </p>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "rounded-2xl border p-8 flex flex-col justify-between transition-all duration-300 bg-card/35 relative text-left",
                  plan.popular
                    ? "border-primary shadow-xl scale-105 z-10 bg-background"
                    : "border-border/60 hover:border-muted-foreground/30"
                )}
              >
                {plan.popular && (
                  <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1 text-[9px] uppercase tracking-wider font-extrabold text-white shadow-md">
                    {plan.badge}
                  </span>
                )}

                <div>
                  <span className="text-[9px] font-bold text-muted-foreground">{plan.name}</span>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-foreground">{plan.price}</span>
                    {plan.period && <span className="text-xs font-semibold text-muted-foreground">/{plan.period}</span>}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{plan.description}</p>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-xs text-foreground">
                        <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Link
                    href="/register"
                    className={cn(
                      "block w-full rounded-xl py-3.5 text-center text-xs font-bold shadow transition-all duration-200 cursor-pointer",
                      plan.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/95 hover:-translate-y-0.5"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/85"
                    )}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Optional Upsells Configurator */}
          <div className="mt-20 rounded-2xl border border-border bg-card/25 p-6 md:p-8 text-left max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4.5 w-4.5 text-accent" />
              <h3 className="text-sm font-bold text-foreground">Pro Addons Customizer</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-6">
              Select optional developer add-ons below to bundle with your Professional Pro plan order.
            </p>

            <div className="space-y-3.5">
              {upsellsList.map((up) => {
                const isSelected = selectedUpsells.includes(up.id);
                return (
                  <button
                    key={up.id}
                    onClick={() => toggleUpsell(up.id)}
                    className={cn(
                      "w-full flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border transition-all text-left cursor-pointer",
                      isSelected
                        ? "bg-primary/5 border-primary shadow-sm"
                        : "border-border/60 hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                        isSelected ? "bg-primary border-primary text-primary-foreground" : "border-border/80"
                      )}>
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">{up.name}</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{up.desc}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-foreground mt-2 sm:mt-0">+${up.price}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Calculated Pro Total</span>
                <div className="text-xl font-black text-foreground mt-0.5">${calculatedProTotal}</div>
              </div>
              <Link
                href={`/register?plan=pro&addons=${selectedUpsells.join(",")}`}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-primary-foreground shadow hover:bg-primary/95 transition-all"
              >
                <ShoppingCart className="h-4 w-4" />
                Checkout Custom Pro Plan
              </Link>
            </div>
          </div>

          {/* Comparison Matrix */}
          <div className="mt-24 rounded-2xl border border-border bg-card/10 overflow-hidden hidden md:block text-left">
            <div className="p-6 bg-muted/20 border-b border-border text-left">
              <h3 className="text-sm font-bold text-foreground">Detailed Plan Matrix</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Compare features across our Hobby, Pro, and Premium tiers.</p>
            </div>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/10 font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
                  <th className="p-4 w-2/5">Feature Matrix</th>
                  <th className="p-4">Hobby</th>
                  <th className="p-4">Pro</th>
                  <th className="p-4">Premium</th>
                </tr>
              </thead>
              <tbody>
                {featuresComparison.map((item) => (
                  <tr key={item.feature} className="border-b border-border/40 hover:bg-muted/10">
                    <td className="p-4 font-semibold text-foreground">{item.feature}</td>
                    <td className="p-4 text-muted-foreground">{item.free}</td>
                    <td className="p-4 text-foreground font-bold">{item.pro}</td>
                    <td className="p-4 text-foreground font-bold">{item.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Accordion FAQ */}
          <div className="mt-24 max-w-3xl mx-auto text-left">
            <h3 className="text-lg font-black text-foreground text-center mb-8">Pricing FAQ</h3>
            <div className="space-y-4">
              {pricingFaq.map((faq, index) => (
                <div key={index} className="rounded-xl border border-border bg-background overflow-hidden transition-all duration-200">
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-left font-bold text-xs sm:text-sm hover:bg-muted/30 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={cn("h-4.5 w-4.5 text-muted-foreground transition-transform duration-200", activeFaq === index && "rotate-180 text-primary")} />
                  </button>
                  <AnimatePresence initial={false}>
                    {activeFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="border-t border-border p-5 text-xs leading-relaxed text-muted-foreground bg-muted/10 text-left">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
