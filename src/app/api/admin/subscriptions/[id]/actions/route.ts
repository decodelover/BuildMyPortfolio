import { NextRequest, NextResponse } from "next/server";
import { AdminBillingService } from "@/lib/admin/admin-billing-service";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { action, newPlan, reason, durationMonths, refundAmount } = body;
    const adminRole = req.headers.get("x-admin-role") || "SUPER_ADMIN";
    const adminId = req.headers.get("x-admin-id") || "admin_session";
    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";

    switch (action) {
      case "upgrade": {
        const res = await AdminBillingService.upgradeSubscription(adminRole, adminId, id, newPlan, ipAddress);
        return NextResponse.json(res);
      }
      case "downgrade": {
        const res = await AdminBillingService.downgradeSubscription(adminRole, adminId, id, newPlan, ipAddress);
        return NextResponse.json(res);
      }
      case "pause": {
        const res = await AdminBillingService.pauseSubscription(adminRole, adminId, id, durationMonths || 1, ipAddress);
        return NextResponse.json(res);
      }
      case "cancel": {
        const res = await AdminBillingService.cancelSubscription(adminRole, adminId, id, reason || "Admin cancellation", ipAddress);
        return NextResponse.json(res);
      }
      case "grant_comp": {
        const res = await AdminBillingService.grantCompAccess(adminRole, adminId, id, newPlan, reason || "Complimentary VIP Access", ipAddress);
        return NextResponse.json(res);
      }
      case "refund": {
        const res = await AdminBillingService.issueRefund(adminRole, adminId, id, refundAmount || 0, reason || "Customer satisfaction refund", ipAddress);
        return NextResponse.json(res);
      }
      default:
        return NextResponse.json({ error: `Unsupported action: ${action}` }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to execute subscription action." },
      { status: error.message?.includes("Forbidden") ? 403 : 500 }
    );
  }
}
