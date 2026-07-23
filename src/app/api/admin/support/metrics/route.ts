import { NextRequest, NextResponse } from "next/server";
import { AdminSupportService } from "@/lib/admin/admin-support-service";

export async function GET(req: NextRequest) {
  try {
    const metrics = await AdminSupportService.getSupportAnalytics();
    return NextResponse.json(metrics);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
