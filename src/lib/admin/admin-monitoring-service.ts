import { AdminRbacEngine } from "./admin-rbac-engine";
import { AdminUserService } from "./admin-user-service";
import {
  SystemLogEntry,
  SystemHealthStatus,
  TrackedError,
  MonitoringAlertRule,
  LogQueryFilter,
  LogQueryResult,
} from "@/types/admin-monitoring";

const MOCK_HEALTH_SEED: SystemHealthStatus[] = [
  { id: "h_1", serviceName: "Application Edge Runtime", category: "CORE", status: "HEALTHY", uptimePercentage: 99.99, latencyMs: 38, lastChecked: new Date().toISOString() },
  { id: "h_2", serviceName: "Next.js Server Actions Engine", category: "CORE", status: "HEALTHY", uptimePercentage: 99.95, latencyMs: 85, lastChecked: new Date().toISOString() },
  { id: "h_3", serviceName: "API Gateway Router", category: "CORE", status: "HEALTHY", uptimePercentage: 99.98, latencyMs: 42, lastChecked: new Date().toISOString() },
  { id: "h_4", serviceName: "Firebase Admin Authentication", category: "INFRASTRUCTURE", status: "HEALTHY", uptimePercentage: 100.0, latencyMs: 64, lastChecked: new Date().toISOString() },
  { id: "h_5", serviceName: "Cloud Firestore Database Grid", category: "INFRASTRUCTURE", status: "HEALTHY", uptimePercentage: 99.99, latencyMs: 18, lastChecked: new Date().toISOString() },
  { id: "h_6", serviceName: "Firebase Storage Buckets", category: "INFRASTRUCTURE", status: "HEALTHY", uptimePercentage: 99.97, latencyMs: 110, lastChecked: new Date().toISOString() },
  { id: "h_7", serviceName: "Cloud Functions Worker Pool", category: "INFRASTRUCTURE", status: "HEALTHY", uptimePercentage: 99.90, latencyMs: 240, lastChecked: new Date().toISOString() },
  { id: "h_8", serviceName: "Google Gemini 1.5 Pro / Flash Gateway", category: "AI", status: "HEALTHY", uptimePercentage: 99.85, latencyMs: 1250, lastChecked: new Date().toISOString() },
  { id: "h_9", serviceName: "OpenAI GPT-4o Multi-Model Provider", category: "AI", status: "HEALTHY", uptimePercentage: 99.80, latencyMs: 1420, lastChecked: new Date().toISOString() },
  { id: "h_10", serviceName: "Anthropic Claude 3.5 Sonnet Gateway", category: "AI", status: "HEALTHY", uptimePercentage: 99.92, latencyMs: 1180, lastChecked: new Date().toISOString() },
  { id: "h_11", serviceName: "Paystack & Billing Webhook Handler", category: "EXTERNAL", status: "HEALTHY", uptimePercentage: 100.0, latencyMs: 95, lastChecked: new Date().toISOString() },
  { id: "h_12", serviceName: "Background Job Worker Queue", category: "CORE", status: "HEALTHY", uptimePercentage: 99.99, latencyMs: 12, lastChecked: new Date().toISOString() },
  { id: "h_13", serviceName: "Transactional Email Dispatcher", category: "EXTERNAL", status: "HEALTHY", uptimePercentage: 99.94, latencyMs: 180, lastChecked: new Date().toISOString() },
  { id: "h_14", serviceName: "Realtime Notification Engine", category: "CORE", status: "HEALTHY", uptimePercentage: 99.99, latencyMs: 22, lastChecked: new Date().toISOString() },
];

const MOCK_LOGS_SEED: SystemLogEntry[] = [
  {
    id: "log_9001",
    timestamp: "2026-07-23T02:45:00Z",
    severity: "INFO",
    source: "SERVER_ACTION",
    module: "AI_OPS",
    service: "CompilerAgent",
    requestId: "req_7081",
    message: "Successfully generated AST blueprint for template tpl_modern_dev in 1,240 ms.",
    executionTimeMs: 1240,
    environment: "production",
  },
  {
    id: "log_9002",
    timestamp: "2026-07-23T02:40:12Z",
    severity: "WARN",
    source: "API_ROUTE",
    module: "BILLING",
    service: "PaystackWebhook",
    requestId: "req_7080",
    message: "Duplicate webhook event signature detected for payment event ev_9912. Safely ignored.",
    executionTimeMs: 45,
    environment: "production",
  },
  {
    id: "log_9003",
    timestamp: "2026-07-23T02:30:15Z",
    severity: "ERROR",
    source: "BACKGROUND_WORKER",
    module: "DATABASE",
    service: "FirestoreSyncWorker",
    requestId: "req_7079",
    errorCode: "FIRESTORE_WRITE_RETRY",
    message: "Firestore batch write transaction deadlocked. Retrying operation (attempt 2/3).",
    executionTimeMs: 890,
    environment: "production",
    stackTrace: "Error: Transaction lock timeout\n    at FirestoreSyncWorker.commitBatch (src/lib/db.ts:142)\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)",
  },
  {
    id: "log_9004",
    timestamp: "2026-07-23T02:15:22Z",
    severity: "CRITICAL",
    source: "SERVER_ACTION",
    module: "AUTH",
    service: "AdminRbacEngine",
    requestId: "req_7078",
    errorCode: "UNAUTHORIZED_ADMIN_ACCESS",
    message: "Unauthorized attempt to access /api/admin/users/bulk without SUPER_ADMIN permissions.",
    executionTimeMs: 12,
    environment: "production",
  },
];

const MOCK_ERRORS_SEED: TrackedError[] = [
  {
    id: "err_301",
    errorTitle: "FIRESTORE_WRITE_RETRY: Batch Transaction Deadlock",
    serviceModule: "DATABASE",
    firstSeen: "2026-07-15T10:00:00Z",
    lastSeen: "2026-07-23T02:30:15Z",
    occurrencesCount: 14,
    affectedUsersCount: 3,
    status: "UNRESOLVED",
    stackTrace: "Error: Transaction lock timeout\n    at FirestoreSyncWorker.commitBatch (src/lib/db.ts:142)\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)",
  },
  {
    id: "err_302",
    errorTitle: "GEMINI_RATE_LIMIT: 429 Resource Exhausted",
    serviceModule: "AI_OPS",
    firstSeen: "2026-07-20T14:20:00Z",
    lastSeen: "2026-07-22T18:00:00Z",
    occurrencesCount: 8,
    affectedUsersCount: 2,
    status: "RESOLVED",
    stackTrace: "GoogleGenerativeAIError: [429] Resource Exhausted: Rate limit exceeded for model gemini-1.5-pro",
  },
];

const MOCK_ALERTS_SEED: MonitoringAlertRule[] = [
  { id: "alt_1", name: "High Error Rate Alert (> 5% Errors)", metricType: "ERROR_RATE", threshold: 5.0, condition: "GREATER_THAN", channels: ["email", "in_app", "slack"], isEnabled: true },
  { id: "alt_2", name: "API Latency Degradation (> 1000ms)", metricType: "LATENCY", threshold: 1000, condition: "GREATER_THAN", channels: ["email", "in_app"], isEnabled: true },
  { id: "alt_3", name: "Service Downtime Monitor", metricType: "SERVICE_DOWN", threshold: 1, condition: "EQUALS", channels: ["email", "in_app", "webhook", "slack"], isEnabled: true },
  { id: "alt_4", name: "AI Provider Failure Threshold", metricType: "AI_FAILURE", threshold: 10, condition: "GREATER_THAN", channels: ["in_app", "email"], isEnabled: true },
];

export class AdminMonitoringService {
  private static healthStore: SystemHealthStatus[] = [...MOCK_HEALTH_SEED];
  private static logsStore: SystemLogEntry[] = [...MOCK_LOGS_SEED];
  private static errorsStore: TrackedError[] = [...MOCK_ERRORS_SEED];
  private static alertsStore: MonitoringAlertRule[] = [...MOCK_ALERTS_SEED];

  public static async getSystemHealthOverview(): Promise<SystemHealthStatus[]> {
    return [...this.healthStore];
  }

  public static async getLogs(query: LogQueryFilter): Promise<LogQueryResult> {
    let filtered = [...this.logsStore];

    if (query.search && query.search.trim()) {
      const q = query.search.toLowerCase().trim();
      filtered = filtered.filter(
        (l) =>
          l.message.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q) ||
          l.service.toLowerCase().includes(q) ||
          l.requestId.toLowerCase().includes(q) ||
          (l.errorCode && l.errorCode.toLowerCase().includes(q))
      );
    }

    if (query.severity && query.severity !== "ALL") {
      filtered = filtered.filter((l) => l.severity.toUpperCase() === query.severity?.toUpperCase());
    }

    if (query.module && query.module !== "ALL") {
      filtered = filtered.filter((l) => l.module.toUpperCase() === query.module?.toUpperCase());
    }

    const total = filtered.length;
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, query.limit || 10);
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return { logs: paginated, total, page, limit, totalPages };
  }

  public static async getErrorsTracked(): Promise<TrackedError[]> {
    return [...this.errorsStore];
  }

  public static async getAlertRules(): Promise<MonitoringAlertRule[]> {
    return [...this.alertsStore];
  }

  public static async toggleAlertRule(adminRole: string, adminId: string, ruleId: string, isEnabled: boolean) {
    if (!AdminRbacEngine.canManageSystemSettings(adminRole)) throw new Error("Forbidden.");
    const rule = this.alertsStore.find((r) => r.id === ruleId);
    if (!rule) throw new Error("Alert rule not found.");

    rule.isEnabled = isEnabled;
    return { success: true, rule: { ...rule } };
  }
}
