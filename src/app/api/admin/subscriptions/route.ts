import { NextRequest, NextResponse } from "next/server";
import { AdminBillingService } from "@/lib/admin/admin-billing-service";
import { SubscriptionDirectoryQuery } from "@/types/admin-billing";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const query: SubscriptionDirectoryQuery = {
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || undefined,
      plan: searchParams.get("plan") || undefined,
      paymentProvider: searchParams.get("paymentProvider") || undefined,
      billingCycle: searchParams.get("billingCycle") || undefined,
      sortBy: (searchParams.get("sortBy") as any) || "currentPeriodEnd",
      sortOrder: (searchParams.get("sortOrder") as any) || "asc",
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "10", 10),
    };

    const result = await AdminBillingService.getSubscriptions(query);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to query subscriptions directory." },
      { status: 500 }
    );
  }
}
