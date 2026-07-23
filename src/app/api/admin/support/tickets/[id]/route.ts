import { NextRequest, NextResponse } from "next/server";
import { AdminSupportService } from "@/lib/admin/admin-support-service";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const ticket = await AdminSupportService.getTicketById(id);
    if (!ticket) return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
    return NextResponse.json(ticket);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { status, priority, assignedAgentId, assignedAgentName } = body;
    const adminRole = req.headers.get("x-admin-role") || "SUPER_ADMIN";
    const adminId = req.headers.get("x-admin-id") || "admin_session";
    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";

    if (status) {
      const res = await AdminSupportService.updateTicketStatus(adminRole, adminId, id, status, ipAddress);
      return NextResponse.json(res);
    }

    if (assignedAgentId && assignedAgentName) {
      const res = await AdminSupportService.assignTicket(adminRole, adminId, id, assignedAgentId, assignedAgentName, ipAddress);
      return NextResponse.json(res);
    }

    return NextResponse.json({ error: "Invalid patch request" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
