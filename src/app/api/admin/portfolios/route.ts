import { NextRequest, NextResponse } from "next/server";
import { AdminPortfolioService } from "@/lib/admin/admin-portfolio-service";
import { PortfolioDirectoryQuery } from "@/types/admin-portfolio";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const query: PortfolioDirectoryQuery = {
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || undefined,
      visibility: searchParams.get("visibility") || undefined,
      templateId: searchParams.get("templateId") || undefined,
      plan: searchParams.get("plan") || undefined,
      minSeoScore: searchParams.get("minSeoScore") ? parseInt(searchParams.get("minSeoScore")!, 10) : undefined,
      sortBy: (searchParams.get("sortBy") as any) || "updatedAt",
      sortOrder: (searchParams.get("sortOrder") as any) || "desc",
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "10", 10),
    };

    const result = await AdminPortfolioService.getPortfolios(query);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to query portfolios directory." }, { status: 500 });
  }
}
