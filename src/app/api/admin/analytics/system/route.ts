import { NextRequest, NextResponse } from "next/server";
import { AdminAnalyticsService } from "@/lib/admin/admin-analytics-service";

export async function GET(req: NextRequest) {
  try {
    const data = await AdminAnalyticsService.getSystemPerformanceAnalytics();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
