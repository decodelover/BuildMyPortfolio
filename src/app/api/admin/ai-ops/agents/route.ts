import { NextRequest, NextResponse } from "next/server";
import { AdminAIOpsService } from "@/lib/admin/admin-ai-ops-service";

export async function GET(req: NextRequest) {
  try {
    const agents = await AdminAIOpsService.getAgents();
    return NextResponse.json({ agents });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { agentId } = await req.json();
    const adminRole = req.headers.get("x-admin-role") || "SUPER_ADMIN";
    const adminId = req.headers.get("x-admin-id") || "admin_session";

    const result = await AdminAIOpsService.runAgentDiagnostics(adminRole, adminId, agentId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
