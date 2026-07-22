import { NextRequest, NextResponse } from "next/server";
import { authorizeApiRequest } from "@/lib/security/api-authorization-guard";

export async function validateAiAccess(
  req: NextRequest,
  _requestedCredits: number = 1
): Promise<{ allowed: boolean; userId?: string; errorResponse?: NextResponse }> {
  const authResult = await authorizeApiRequest(req, "use_ai");
  if (!authResult.allowed) {
    return authResult;
  }

  return {
    allowed: true,
    userId: authResult.userId,
  };
}
