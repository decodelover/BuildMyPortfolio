import { NextRequest, NextResponse } from "next/server";
import { AdminMonitoringService } from "@/lib/admin/admin-monitoring-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = {
      search: searchParams.get("search") || undefined,
      severity: searchParams.get("severity") || undefined,
      module: searchParams.get("module") || undefined,
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "10", 10),
    };
    const result = await AdminMonitoringService.getLogs(query);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
