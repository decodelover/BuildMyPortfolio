import { NextRequest, NextResponse } from "next/server";
import { AdminPortfolioService } from "@/lib/admin/admin-portfolio-service";

export async function GET(req: NextRequest) {
  try {
    const queue = await AdminPortfolioService.getModerationQueue();
    return NextResponse.json({ queue });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, portfolioId, reason, notes } = body;
    const adminRole = req.headers.get("x-admin-role") || "SUPER_ADMIN";
    const adminId = req.headers.get("x-admin-id") || "admin_session";
    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";

    if (action === "approve") {
      const res = await AdminPortfolioService.approveModeration(adminRole, adminId, portfolioId, notes, ipAddress);
      return NextResponse.json(res);
    }

    if (action === "reject") {
      const res = await AdminPortfolioService.rejectModeration(adminRole, adminId, portfolioId, reason, notes, ipAddress);
      return NextResponse.json(res);
    }

    return NextResponse.json({ error: `Unsupported moderation action: ${action}` }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
