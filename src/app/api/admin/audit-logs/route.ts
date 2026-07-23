import { NextRequest, NextResponse } from "next/server";
import { AdminUserService } from "@/lib/admin/admin-user-service";

export async function GET(req: NextRequest) {
  try {
    const logs = await AdminUserService.getAuditLogs();
    return NextResponse.json({ logs });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to retrieve audit logs." },
      { status: 500 }
    );
  }
}
