import { NextRequest, NextResponse } from "next/server";
import { AdminMonitoringService } from "@/lib/admin/admin-monitoring-service";

export async function GET(req: NextRequest) {
  try {
    const health = await AdminMonitoringService.getSystemHealthOverview();
    return NextResponse.json({ health });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
