export interface SecurityAuditEvent {
  userId?: string;
  eventType: "permission_check" | "access_denied" | "unauthorized_api_attempt" | "subscription_validation";
  permissionKey?: string;
  allowed: boolean;
  reason?: string;
  path?: string;
  ipAddress?: string;
  timestamp: string;
}

export class AuthorizationAuditLogger {
  private static logs: SecurityAuditEvent[] = [];

  public static logEvent(event: Omit<SecurityAuditEvent, "timestamp">): SecurityAuditEvent {
    const fullEvent: SecurityAuditEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    };

    this.logs.push(fullEvent);
    if (!event.allowed) {
      console.warn(
        `[SECURITY AUDIT - ACCESS DENIED] Event: ${event.eventType} | User: ${event.userId || "anonymous"} | Permission: ${
          event.permissionKey || "N/A"
        } | Path: ${event.path || "N/A"} | Reason: ${event.reason || "Unauthorized"}`
      );
    }
    return fullEvent;
  }

  public static getLogs(userId?: string): SecurityAuditEvent[] {
    if (userId) {
      return this.logs.filter((l) => l.userId === userId);
    }
    return this.logs;
  }
}
