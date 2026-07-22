import { PromotionalCampaign } from "../types";

export class PromotionService {
  private static campaigns: PromotionalCampaign[] = [
    {
      campaignId: "cmp-launch-2026",
      name: "Platform Launch Special",
      type: "launch",
      discountPercentage: 20,
      startDate: "2026-01-01T00:00:00Z",
      endDate: "2030-12-31T23:59:59Z",
      bannerText: "🚀 Platform Launch Special: Enjoy 20% off all Annual Plans with instant access to AI credits!",
      isActive: true,
    },
    {
      campaignId: "cmp-cyber-2026",
      name: "Cyber Season Upgrade Sale",
      type: "cyber_monday",
      discountPercentage: 30,
      startDate: "2026-11-01T00:00:00Z",
      endDate: "2026-12-05T23:59:59Z",
      bannerText: "⚡ Limited Time Offer: 30% discount on Business Tier subscriptions!",
      isActive: false,
    },
  ];

  public static getActiveCampaigns(): PromotionalCampaign[] {
    const now = Date.now();
    return this.campaigns.filter((cmp) => {
      if (!cmp.isActive) return false;
      const start = new Date(cmp.startDate).getTime();
      const end = new Date(cmp.endDate).getTime();
      return now >= start && now <= end;
    });
  }

  public static getPrimaryActiveBanner(): PromotionalCampaign | null {
    const active = this.getActiveCampaigns();
    return active.length > 0 ? active[0] : null;
  }
}
