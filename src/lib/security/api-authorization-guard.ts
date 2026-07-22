import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { PermissionEngine } from "@/lib/billing-engine/engine/permission-engine";
import { AuthorizationAuditLogger } from "./authorization-audit-logger";

export async function authorizeApiRequest(
  req: NextRequest,
  requiredPermissionKey?: string
): Promise<{ allowed: boolean; userId?: string; errorResponse?: NextResponse }> {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      AuthorizationAuditLogger.logEvent({
        eventType: "unauthorized_api_attempt",
        allowed: false,
        reason: "Missing Bearer token authorization header",
        path: req.nextUrl.pathname,
      });

      return {
        allowed: false,
        errorResponse: NextResponse.json(
          { error: "Authentication required. Missing authorization header token." },
          { status: 401 }
        ),
      };
    }

    if (!adminAuth) {
      return {
        allowed: true,
        userId: "dev-user-local",
      };
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    if (requiredPermissionKey) {
      const permissionCheck = PermissionEngine.checkPermission(userId, requiredPermissionKey);

      AuthorizationAuditLogger.logEvent({
        userId,
        eventType: permissionCheck.allowed ? "permission_check" : "access_denied",
        permissionKey: requiredPermissionKey,
        allowed: permissionCheck.allowed,
        reason: permissionCheck.reason,
        path: req.nextUrl.pathname,
      });

      if (!permissionCheck.allowed) {
        return {
          allowed: false,
          userId,
          errorResponse: NextResponse.json(
            {
              error: permissionCheck.reason || "Access denied.",
              permissionKey: requiredPermissionKey,
              requiresUpgrade: true,
            },
            { status: 403 }
          ),
        };
      }
    }

    return { allowed: true, userId };
  } catch (error: any) {
    AuthorizationAuditLogger.logEvent({
      eventType: "unauthorized_api_attempt",
      allowed: false,
      reason: error?.message || "Invalid authentication token",
      path: req.nextUrl.pathname,
    });

    return {
      allowed: false,
      errorResponse: NextResponse.json(
        { error: "Invalid authentication session token." },
        { status: 401 }
      ),
    };
  }
}
