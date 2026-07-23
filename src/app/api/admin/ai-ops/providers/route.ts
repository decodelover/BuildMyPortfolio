import { NextRequest, NextResponse } from "next/server";
import { AdminAIOpsService } from "@/lib/admin/admin-ai-ops-service";

export async function GET(req: NextRequest) {
  try {
    const providers = await AdminAIOpsService.getProviders();
    return NextResponse.json({ providers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
