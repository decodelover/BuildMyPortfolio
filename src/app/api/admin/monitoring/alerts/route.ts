import { NextRequest, NextResponse } from "next/server";
import { AdminMonitoringService } from "@/lib/admin/admin-monitoring-service";

export async function GET(req: NextRequest) {
  try {
    const alerts = await AdminMonitoringService.getAlertRules();
    return NextResponse.json({ alerts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { ruleId, isEnabled } = await req.json();
    const adminRole = req.headers.get("x-admin-role") || "SUPER_ADMIN";
    const adminId = req.headers.get("x-admin-id") || "admin_session";

    const res = await AdminMonitoringService.toggleAlertRule(adminRole, adminId, ruleId, isEnabled);
    return NextResponse.json(res);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
