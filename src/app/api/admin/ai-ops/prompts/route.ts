import { NextRequest, NextResponse } from "next/server";
import { AdminAIOpsService } from "@/lib/admin/admin-ai-ops-service";

export async function GET(req: NextRequest) {
  try {
    const prompts = await AdminAIOpsService.getPrompts();
    return NextResponse.json({ prompts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { promptId, templateText, changeNotes } = await req.json();
    const adminRole = req.headers.get("x-admin-role") || "SUPER_ADMIN";
    const adminId = req.headers.get("x-admin-id") || "admin_session";

    const res = await AdminAIOpsService.updatePromptTemplate(
      adminRole,
      adminId,
      promptId,
      templateText,
      changeNotes || "Updated prompt template version"
    );
    return NextResponse.json(res);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { promptId, targetVersion } = await req.json();
    const adminRole = req.headers.get("x-admin-role") || "SUPER_ADMIN";
    const adminId = req.headers.get("x-admin-id") || "admin_session";

    const res = await AdminAIOpsService.rollbackPromptTemplate(
      adminRole,
      adminId,
      promptId,
      targetVersion
    );
    return NextResponse.json(res);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
