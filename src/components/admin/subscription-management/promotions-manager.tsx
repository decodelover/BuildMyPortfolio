"use client";

import React, { useState, useEffect } from "react";
import { AdminCoupon } from "@/types/admin-billing";
import { Tag, Plus, RefreshCw, CheckCircle2, Ban, Gift, Sparkles } from "lucide-react";

export function PromotionsManager() {
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed_amount">("percentage");
  const [discountValue, setDiscountValue] = useState<number>(20);
  const [maxRedemptions, setMaxRedemptions] = useState<number>(100);

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/promotions");
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          discountType,
          discountValue,
          maxRedemptions,
          duration: "once",
        }),
      });
      if (res.ok) {
        setShowCreateModal(false);
        setCode("");
        fetchCoupons();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" /> Promotional Coupons &amp; Referral Campaigns
          </h3>
          <p className="text-xs text-muted-foreground">Manage discount codes, campaign tracking, and promotional credit grants.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-primary text-primary-foreground rounded-xl shadow-xs hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Create New Coupon
          </button>
          <button onClick={fetchCoupons} className="p-2 rounded-xl bg-secondary border border-border">
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b bg-muted/40 text-muted-foreground font-semibold uppercase">
            <tr>
              <th className="py-3 px-4">Coupon Code</th>
              <th className="py-3 px-4">Discount</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Redemptions</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Created Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-muted/20">
                <td className="py-3.5 px-4 font-mono font-bold text-primary">{c.code}</td>
                <td className="py-3.5 px-4 font-bold text-foreground">
                  {c.discountType === "percentage" ? `${c.discountValue}% OFF` : `$${c.discountValue} OFF`}
                </td>
                <td className="py-3.5 px-4 capitalize text-muted-foreground">{c.duration}</td>
                <td className="py-3.5 px-4 font-medium">
                  {c.redemptionsCount} / {c.maxRedemptions || "∞"}
                </td>
                <td className="py-3.5 px-4">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    c.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                  }`}>
                    {c.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-muted-foreground">{c.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground">Create Promotional Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. SUMMER20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-xl font-mono uppercase bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-xl bg-background"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_amount">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Discount Value</label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(parseFloat(e.target.value))}
                    required
                    className="w-full px-3 py-2 border rounded-xl bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Max Redemptions</label>
                <input
                  type="number"
                  value={maxRedemptions}
                  onChange={(e) => setMaxRedemptions(parseInt(e.target.value, 10))}
                  required
                  className="w-full px-3 py-2 border rounded-xl bg-background"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-secondary rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl">
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
