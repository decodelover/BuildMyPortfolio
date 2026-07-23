import { NextRequest, NextResponse } from "next/server";
import { AdminPortfolioService } from "@/lib/admin/admin-portfolio-service";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { action, reason, newOwnerId, newOwnerEmail } = body;
    const adminRole = req.headers.get("x-admin-role") || "SUPER_ADMIN";
    const adminId = req.headers.get("x-admin-id") || "admin_session";
    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";

    switch (action) {
      case "publish": {
        const res = await AdminPortfolioService.publishPortfolio(adminRole, adminId, id, ipAddress);
        return NextResponse.json(res);
      }
      case "unpublish": {
        const res = await AdminPortfolioService.unpublishPortfolio(adminRole, adminId, id, reason || "Admin unpublish", ipAddress);
        return NextResponse.json(res);
      }
      case "archive": {
        const res = await AdminPortfolioService.archivePortfolio(adminRole, adminId, id, ipAddress);
        return NextResponse.json(res);
      }
      case "transfer": {
        const res = await AdminPortfolioService.transferOwnership(adminRole, adminId, id, newOwnerId, newOwnerEmail, ipAddress);
        return NextResponse.json(res);
      }
      default:
        return NextResponse.json({ error: `Unsupported action: ${action}` }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
