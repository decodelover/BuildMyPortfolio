import { NextRequest, NextResponse } from "next/server";
import { AdminUserService } from "@/lib/admin/admin-user-service";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { action, reason, durationDays } = body;
    const adminRole = req.headers.get("x-admin-role") || "SUPER_ADMIN";
    const adminId = req.headers.get("x-admin-id") || "admin_session";
    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";

    switch (action) {
      case "suspend": {
        const res = await AdminUserService.suspendUser(
          adminRole,
          adminId,
          id,
          reason,
          durationDays,
          ipAddress
        );
        return NextResponse.json(res);
      }
      case "reactivate": {
        const res = await AdminUserService.reactivateUser(
          adminRole,
          adminId,
          id,
          ipAddress
        );
        return NextResponse.json(res);
      }
      case "disable": {
        const res = await AdminUserService.disableUser(
          adminRole,
          adminId,
          id,
          reason,
          ipAddress
        );
        return NextResponse.json(res);
      }
      case "reset_password": {
        const res = await AdminUserService.resetPassword(
          adminRole,
          adminId,
          id,
          ipAddress
        );
        return NextResponse.json(res);
      }
      case "verify_email": {
        const res = await AdminUserService.verifyEmail(
          adminRole,
          adminId,
          id,
          ipAddress
        );
        return NextResponse.json(res);
      }
      case "force_logout": {
        const res = await AdminUserService.forceLogout(
          adminRole,
          adminId,
          id,
          ipAddress
        );
        return NextResponse.json(res);
      }
      case "impersonate": {
        const res = await AdminUserService.impersonateUser(
          adminRole,
          adminId,
          id,
          ipAddress
        );
        return NextResponse.json(res);
      }
      case "export": {
        const data = await AdminUserService.exportUserData(
          adminRole,
          adminId,
          id,
          ipAddress
        );
        return new NextResponse(data, {
          headers: {
            "Content-Type": "application/json",
            "Content-Disposition": `attachment; filename="user_${id}_export.json"`,
          },
        });
      }
      default:
        return NextResponse.json(
          { error: `Unsupported administrative action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to execute user management action." },
      { status: error.message?.includes("Forbidden") ? 403 : 500 }
    );
  }
}
