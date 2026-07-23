import { NextRequest, NextResponse } from "next/server";
import { AdminSupportService } from "@/lib/admin/admin-support-service";

export async function GET(req: NextRequest) {
  try {
    const articles = await AdminSupportService.getKnowledgeBaseArticles();
    return NextResponse.json({ articles });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
