import { NextRequest, NextResponse } from "next/server";
import { AdminUserService } from "@/lib/admin/admin-user-service";
import { UserDirectoryQuery } from "@/types/admin-user";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const query: UserDirectoryQuery = {
      search: searchParams.get("search") || undefined,
      role: searchParams.get("role") || undefined,
      plan: searchParams.get("plan") || undefined,
      status: searchParams.get("status") || undefined,
      country: searchParams.get("country") || undefined,
      authProvider: searchParams.get("authProvider") || undefined,
      activity: searchParams.get("activity") || undefined,
      regDateRange: (searchParams.get("regDateRange") as any) || undefined,
      lastLoginRange: (searchParams.get("lastLoginRange") as any) || undefined,
      sortBy: (searchParams.get("sortBy") as any) || "registrationDate",
      sortOrder: (searchParams.get("sortOrder") as any) || "desc",
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "10", 10),
    };

    const result = await AdminUserService.getUsers(query);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to query user directory." },
      { status: 500 }
    );
  }
}
