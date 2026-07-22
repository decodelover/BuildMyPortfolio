"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, X, ArrowRight } from "lucide-react";
import { PromotionalCampaign } from "@/lib/billing-engine/types";

interface PromotionBannerProps {
  onUpgradeClick?: () => void;
}

export function PromotionBanner({ onUpgradeClick }: PromotionBannerProps) {
  const [campaign, setCampaign] = useState<PromotionalCampaign | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch("/api/billing/promotions");
        const data = await response.json();
        if (data.primaryBanner) {
          setCampaign(data.primaryBanner);
        }
      } catch (_err) {
        console.warn("Could not load promotion campaign banner.");
      }
    };
    fetchPromotions();
  }, []);

  if (!campaign || dismissed) return null;

  return (
    <div className="relative rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/15 via-primary/10 to-card p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black shrink-0 shadow-sm">
          <Sparkles className="h-4.5 w-4.5" />
        </div>
        <div className="space-y-0.5">
          <span className="font-bold text-foreground block text-sm">{campaign.name}</span>
          <p className="text-muted-foreground leading-relaxed">{campaign.bannerText}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
        <button
          onClick={onUpgradeClick}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/95 transition-all"
        >
          Claim {campaign.discountPercentage}% Discount <ArrowRight className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
