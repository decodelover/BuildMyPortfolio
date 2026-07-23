export type LogSeverityLevel = "INFO" | "WARN" | "ERROR" | "CRITICAL";

export type LogServiceModule =
  | "AUTH"
  | "BILLING"
  | "AI_OPS"
  | "PORTFOLIO_ENGINE"
  | "DATABASE"
  | "STORAGE"
  | "SYSTEM"
  | "API_GATEWAY";

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  severity: LogSeverityLevel;
  source: "CLIENT" | "SERVER_ACTION" | "API_ROUTE" | "BACKGROUND_WORKER";
  module: LogServiceModule;
  service: string;
  userId?: string;
  requestId: string;
  errorCode?: string;
  message: string;
  executionTimeMs: number;
  environment: "production" | "staging";
  stackTrace?: string;
  metadata?: Record<string, any>;
}

export interface SystemHealthStatus {
  id: string;
  serviceName: string;
  category: "CORE" | "AI" | "INFRASTRUCTURE" | "EXTERNAL";
  status: "HEALTHY" | "DEGRADED" | "CRITICAL";
  uptimePercentage: number;
  latencyMs: number;
  lastChecked: string;
  details?: string;
}

export interface TrackedError {
  id: string;
  errorTitle: string;
  serviceModule: LogServiceModule;
  firstSeen: string;
  lastSeen: string;
  occurrencesCount: number;
  affectedUsersCount: number;
  status: "UNRESOLVED" | "RESOLVED" | "IGNORED";
  stackTrace: string;
}

export interface MonitoringAlertRule {
  id: string;
  name: string;
  metricType: "ERROR_RATE" | "LATENCY" | "SERVICE_DOWN" | "AI_FAILURE" | "STORAGE_LIMIT";
  threshold: number;
  condition: "GREATER_THAN" | "LESS_THAN" | "EQUALS";
  channels: Array<"email" | "in_app" | "webhook" | "slack">;
  isEnabled: boolean;
  lastTriggered?: string;
}

export interface LogQueryFilter {
  search?: string;
  severity?: string;
  module?: string;
  source?: string;
  environment?: string;
  page: number;
  limit: number;
}

export interface LogQueryResult {
  logs: SystemLogEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
