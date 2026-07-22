import { NextRequest, NextResponse } from "next/server";
import { authorizeApiRequest } from "@/lib/security/api-authorization-guard";
import { BillingAnalyticsService, TimeRangeFilter } from "@/lib/billing-engine/analytics/billing-analytics-service";

export async function GET(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req);
    if (!authResult.allowed) {
      return authResult.errorResponse || NextResponse.json({ error: "Unauthorized access request." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const timeRange = (searchParams.get("timeRange") as TimeRangeFilter) || "30d";

    const analyticsSummary = BillingAnalyticsService.calculateSummary([], [], [], timeRange);

    return NextResponse.json({
      status: "success",
      summary: analyticsSummary,
    });
  } catch (error: any) {
    console.error("Admin Analytics Overview API Error:", error);
    return NextResponse.json({ error: error?.message || "Failed to fetch analytics overview." }, { status: 500 });
  }
}
