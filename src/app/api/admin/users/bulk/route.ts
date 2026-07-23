import { NextRequest, NextResponse } from "next/server";
import { AdminUserService } from "@/lib/admin/admin-user-service";
import { BulkActionRequest } from "@/types/admin-user";

export async function POST(req: NextRequest) {
  try {
    const body: BulkActionRequest = await req.json();
    const { action, userIds, payload } = body;
    const adminRole = req.headers.get("x-admin-role") || "SUPER_ADMIN";
    const adminId = req.headers.get("x-admin-id") || "admin_session";
    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "No user IDs provided for bulk operation." },
        { status: 400 }
      );
    }

    switch (action) {
      case "suspend": {
        const res = await AdminUserService.bulkSuspendUsers(
          adminRole,
          adminId,
          userIds,
          payload?.reason || "Bulk suspend",
          ipAddress
        );
        return NextResponse.json(res);
      }
      case "delete": {
        const res = await AdminUserService.bulkDeleteUsers(
          adminRole,
          adminId,
          userIds,
          ipAddress
        );
        return NextResponse.json(res);
      }
      case "assign_role": {
        if (!payload?.newRole) {
          return NextResponse.json(
            { error: "Missing newRole payload for role assignment." },
            { status: 400 }
          );
        }
        const res = await AdminUserService.bulkAssignRoles(
          adminRole,
          adminId,
          userIds,
          payload.newRole,
          ipAddress
        );
        return NextResponse.json(res);
      }
      case "assign_plan": {
        if (!payload?.newPlan) {
          return NextResponse.json(
            { error: "Missing newPlan payload for plan assignment." },
            { status: 400 }
          );
        }
        const res = await AdminUserService.bulkAssignPlans(
          adminRole,
          adminId,
          userIds,
          payload.newPlan,
          ipAddress
        );
        return NextResponse.json(res);
      }
      case "export": {
        const format = payload?.exportFormat || "csv";
        const content = await AdminUserService.bulkExportUsers(
          adminRole,
          adminId,
          userIds,
          format,
          ipAddress
        );

        if (format === "json") {
          return new NextResponse(content, {
            headers: {
              "Content-Type": "application/json",
              "Content-Disposition": 'attachment; filename="users_export.json"',
            },
          });
        }

        return new NextResponse(content, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": 'attachment; filename="users_export.csv"',
          },
        });
      }
      default:
        return NextResponse.json(
          { error: `Unsupported bulk action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to execute bulk user operation." },
      { status: error.message?.includes("Forbidden") ? 403 : 500 }
    );
  }
}
