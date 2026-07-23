import { NextRequest, NextResponse } from "next/server";
import { AdminAIOpsService } from "@/lib/admin/admin-ai-ops-service";

export async function GET(req: NextRequest) {
  try {
    const metrics = await AdminAIOpsService.getMetrics();
    return NextResponse.json(metrics);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
