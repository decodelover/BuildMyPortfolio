"use client";

import React from "react";
import { CreditCard, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import { PaymentProviderId } from "@/lib/billing-engine/types";

interface PaymentMethodCardProps {
  providerId?: PaymentProviderId;
  customerEmail?: string;
  onManageClick?: () => void;
}

export function PaymentMethodCard({
  providerId = "paystack",
  customerEmail = "user@buildmyportfolio.com",
  onManageClick,
}: PaymentMethodCardProps) {
  const providerName = providerId === "flutterwave" ? "Flutterwave" : providerId === "stripe" ? "Stripe" : "Paystack";

  return (
    <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md p-6 space-y-6 shadow-sm flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Default Payment Provider</h3>
              <span className="text-[11px] text-muted-foreground">PCI-DSS Compliant Encryption</span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" />
            Active ({providerName})
          </span>
        </div>

        <div className="rounded-xl border border-border/60 bg-gradient-to-br from-muted/30 to-card p-4 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-muted-foreground">Authorized Account</span>
            <span className="font-bold text-foreground truncate max-w-[180px]">{customerEmail}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-muted-foreground">Gateway Protocol</span>
            <span className="font-bold text-foreground uppercase">{providerName} Recurring Checkout</span>
          </div>

          <div className="flex items-center gap-2 pt-2 text-[10px] text-muted-foreground border-t border-border/40">
            <Lock className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>256-Bit SSL End-to-End Encrypted Transactions</span>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={onManageClick}
          className="w-full rounded-xl border border-border bg-secondary/50 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary transition-all flex items-center justify-center gap-1.5 shadow-sm"
        >
          <ShieldCheck className="h-4 w-4 text-primary" />
          Update Payment Provider Settings
        </button>
      </div>
    </div>
  );
}
