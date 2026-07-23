import { NextRequest, NextResponse } from "next/server";
import { AdminSupportService } from "@/lib/admin/admin-support-service";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { messageText, isInternalNote } = body;
    const adminRole = req.headers.get("x-admin-role") || "SUPER_ADMIN";
    const adminId = req.headers.get("x-admin-id") || "admin_session";
    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";

    const res = await AdminSupportService.replyToTicket(adminRole, adminId, id, messageText, isInternalNote, ipAddress);
    return NextResponse.json(res);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
