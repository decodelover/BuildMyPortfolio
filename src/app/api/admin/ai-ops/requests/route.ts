import { NextRequest, NextResponse } from "next/server";
import { AdminAIOpsService } from "@/lib/admin/admin-ai-ops-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = {
      search: searchParams.get("search") || undefined,
      agentId: searchParams.get("agentId") || undefined,
      providerId: searchParams.get("providerId") || undefined,
      status: searchParams.get("status") || undefined,
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "10", 10),
    };
    const result = await AdminAIOpsService.getRequests(query);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
