import { NextRequest, NextResponse } from "next/server";
import { AdminPortfolioService } from "@/lib/admin/admin-portfolio-service";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const portfolio = await AdminPortfolioService.getPortfolioById(id);
    if (!portfolio) return NextResponse.json({ error: "Portfolio not found." }, { status: 404 });
    return NextResponse.json(portfolio);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(req.url);
    const confirmationName = searchParams.get("confirmationName") || "";
    const adminRole = req.headers.get("x-admin-role") || "SUPER_ADMIN";
    const adminId = req.headers.get("x-admin-id") || "admin_session";
    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";

    const res = await AdminPortfolioService.deletePortfolio(adminRole, adminId, id, confirmationName, ipAddress);
    return NextResponse.json(res);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
