import { NextResponse } from "next/server";
import { PromotionService } from "@/lib/billing-engine/promotions/promotion-service";

export async function GET() {
  try {
    const activeCampaigns = PromotionService.getActiveCampaigns();
    const primaryBanner = PromotionService.getPrimaryActiveBanner();

    return NextResponse.json({
      status: "success",
      activeCampaigns,
      primaryBanner,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Internal server error." }, { status: 500 });
  }
}
