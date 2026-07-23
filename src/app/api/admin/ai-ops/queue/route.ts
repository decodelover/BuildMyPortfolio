import { NextRequest, NextResponse } from "next/server";
import { AdminAIOpsService } from "@/lib/admin/admin-ai-ops-service";

export async function GET(req: NextRequest) {
  try {
    const queue = await AdminAIOpsService.getQueue();
    return NextResponse.json({ queue });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, jobId, priority } = body;
    const adminRole = req.headers.get("x-admin-role") || "SUPER_ADMIN";
    const adminId = req.headers.get("x-admin-id") || "admin_session";

    if (action === "retry") {
      const res = await AdminAIOpsService.retryQueueJob(adminRole, adminId, jobId);
      return NextResponse.json(res);
    }

    if (action === "cancel") {
      const res = await AdminAIOpsService.cancelQueueJob(adminRole, adminId, jobId);
      return NextResponse.json(res);
    }

    if (action === "prioritize") {
      const res = await AdminAIOpsService.prioritizeQueueJob(adminRole, adminId, jobId, priority);
      return NextResponse.json(res);
    }

    return NextResponse.json({ error: `Unsupported queue action: ${action}` }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
