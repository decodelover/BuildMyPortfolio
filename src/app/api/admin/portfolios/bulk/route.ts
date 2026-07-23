import { NextRequest, NextResponse } from "next/server";
import { AdminPortfolioService } from "@/lib/admin/admin-portfolio-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const adminRole = req.headers.get("x-admin-role") || "SUPER_ADMIN";
    const adminId = req.headers.get("x-admin-id") || "admin_session";
    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";

    const res = await AdminPortfolioService.bulkOperations(adminRole, adminId, body, ipAddress);
    return NextResponse.json(res);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
