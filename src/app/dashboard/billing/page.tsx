"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle2, Zap, ArrowUpRight, DollarSign, Download, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const planUpgrades = [
  {
    id: "PRO",
    name: "PRO LICENSE",
    price: "$39",
    type: "One-Time Payment",
    desc: "Best for active software engineers and freelancers seeking jobs.",
    features: [
      "Create unlimited portfolios",
      "Connect custom domains + automatic SSL",
      "Unlock all premium templates (Cyberpunk, Brutalist)",
      "Uncapped Gemini AI copywriting assistant",
      "Remove BuildMyPortfolio footer branding logo",
    ],
  },
  {
    id: "ELITE",
    name: "ELITE AGENCY",
    price: "$79",
    type: "One-Time Payment",
    desc: "Perfect for developer design houses and agencies handling multiple clients.",
    features: [
      "Everything in Pro",
      "Multi-developer team settings dashboard",
      "Clean source code export (.zip React files)",
      "White-label client administration portals",
      "Direct API access to generation systems",
    ],
  },
];

const mockInvoiceHistory = [
  { id: "INV-1082", date: "July 12, 2026", plan: "Hobbyist (Free)", amount: "$0.00", status: "Paid" },
];

export default function BillingPage() {
  const { user } = useAuthStore();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    setLoadingPlan(planId);
    try {
      // Simulate/prepare payment provider link trigger (e.g. Stripe checkout)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(`Redirecting to Stripe checkout portal for the ${planId} plan...`);
    } catch (err) {
      toast.error("Billing integration checkout failure.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="space-y-8 text-left max-w-5xl">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight">Billing &amp; Subscription</h1>
        <p className="text-sm text-muted-foreground">Manage your plan membership, invoice logs, and payment configurations.</p>
      </div>

      {/* Current plan card */}
      <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="flex gap-4 items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground">Current Membership Level</span>
            <div className="flex items-center gap-2 mt-0.5">
              <h2 className="text-xl font-black text-foreground">{user?.currentPlan || "FREE"}</h2>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[9px] font-bold text-muted-foreground uppercase border border-border">
                One-time license
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground flex gap-8">
          <div>
            <span className="block font-semibold">AI Writing Quota</span>
            <span className="text-foreground font-bold">{user?.aiCredits ?? 100} / 100 Credits</span>
          </div>
          <div>
            <span className="block font-semibold">Active Portfolios</span>
            <span className="text-foreground font-bold">1 / Unlimited</span>
          </div>
        </div>
      </div>

      {/* Upgrade plans section */}
      {user?.currentPlan !== "ELITE" && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-foreground">Available Upgrades</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {planUpgrades
              .filter((p) => user?.currentPlan !== p.id && (user?.currentPlan === "FREE" || p.id !== "PRO"))
              .map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between hover:border-primary/45 transition-colors shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">{plan.name}</h4>
                        <span className="text-[10px] text-muted-foreground font-semibold">{plan.type}</span>
                      </div>
                      <span className="text-2xl font-black text-primary">{plan.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{plan.desc}</p>
                    
                    <ul className="space-y-2.5 pt-2">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex gap-2 items-start text-xs text-foreground">
                          <CheckCircle2 className="h-4.5 w-4.5 text-accent shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={loadingPlan !== null}
                    className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 text-xs font-semibold shadow hover:bg-primary/95 transition-all mt-6 flex items-center justify-center gap-1.5"
                  >
                    {loadingPlan === plan.id ? (
                      "Loading Checkout..."
                    ) : (
                      <>
                        Upgrade Now
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Invoice history */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Payment Invoice History</h3>
        
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="p-4">Invoice ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Plan Description</th>
                <th className="p-4">Charged Amount</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs text-muted-foreground divide-y divide-border/60">
              {mockInvoiceHistory.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-bold text-foreground">{invoice.id}</td>
                  <td className="p-4">{invoice.date}</td>
                  <td className="p-4">{invoice.plan}</td>
                  <td className="p-4 text-foreground font-semibold">{invoice.amount}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => toast.success("Downloading PDF copy of invoice...")}
                      className="inline-flex items-center gap-1.5 hover:text-primary transition-colors font-bold"
                    >
                      <Download className="h-3.5 w-3.5" />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
