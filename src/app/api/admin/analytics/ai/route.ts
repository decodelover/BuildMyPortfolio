import { NextRequest, NextResponse } from "next/server";
import { AdminAnalyticsService } from "@/lib/admin/admin-analytics-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const timeframe = (searchParams.get("timeframe") as any) || "30d";
    const data = await AdminAnalyticsService.getAIOperationsAnalytics({ timeframe });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
