"use client";

import React, { useState } from "react";
import { Tag, Check, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface CouponInputProps {
  originalPrice: number;
  planId?: string;
  onCouponApplied?: (discountAmount: number, code: string) => void;
}

export function CouponInput({ originalPrice, planId, onCouponApplied }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    finalPrice: number;
  } | null>(null);

  const handleValidateAndApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/billing/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim(),
          originalPrice,
          planId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Invalid promo code.");
      }

      setAppliedCoupon({
        code: data.code,
        discountAmount: data.discountAmount,
        finalPrice: data.finalPrice,
      });

      toast.success(`Promo code ${data.code} applied! Saved $${data.discountAmount}.00`);
      if (onCouponApplied) {
        onCouponApplied(data.discountAmount, data.code);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to validate promo code.");
      setAppliedCoupon(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setAppliedCoupon(null);
    setCode("");
    toast.info("Promo code removed.");
    if (onCouponApplied) {
      onCouponApplied(0, "");
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
        <Tag className="h-4 w-4 text-primary" />
        <span>Have a Promo Coupon Code?</span>
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-500 shrink-0" />
            <div>
              <span className="font-bold text-emerald-500 uppercase">{appliedCoupon.code}</span>
              <span className="text-muted-foreground block text-[11px]">
                Discount Applied: -${appliedCoupon.discountAmount}.00 (Final: ${appliedCoupon.finalPrice}.00)
              </span>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="text-[11px] font-bold text-rose-500 hover:underline shrink-0"
          >
            Remove
          </button>
        </div>
      ) : (
        <form onSubmit={handleValidateAndApply} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter code (e.g. LAUNCH20)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground uppercase tracking-wider placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                Apply <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>
      )}

      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
        <Sparkles className="h-3 w-3 text-primary shrink-0" />
        <span>Try code <code className="font-bold text-foreground">LAUNCH20</code> for 20% off annual checkout!</span>
      </div>
    </div>
  );
}
