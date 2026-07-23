import { NextRequest, NextResponse } from "next/server";
import { AdminBillingService } from "@/lib/admin/admin-billing-service";

export async function GET(req: NextRequest) {
  try {
    const metrics = await AdminBillingService.getFinancialMetrics();
    return NextResponse.json(metrics);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
