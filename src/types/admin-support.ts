import { SubscriptionPlanType } from "./admin-user";

export type SupportTicketPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT" | "CRITICAL";

export type SupportTicketStatus = "OPEN" | "PENDING" | "WAITING_FOR_CUSTOMER" | "RESOLVED" | "CLOSED" | "ESCALATED";

export type SupportTicketCategory =
  | "BILLING"
  | "AI_GENERATION"
  | "CUSTOM_DOMAIN"
  | "PORTFOLIO_BUILDER"
  | "ACCOUNT_ACCESS"
  | "FEATURE_REQUEST";

export interface SupportTicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderType: "customer" | "agent" | "system";
  messageText: string;
  isInternalNote: boolean;
  attachments?: Array<{ name: string; sizeBytes: number; url: string }>;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPlan: SubscriptionPlanType;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  category: SupportTicketCategory;
  assignedAgentId?: string;
  assignedAgentName?: string;
  responseSlaBreached: boolean;
  resolutionSlaBreached: boolean;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  messages: SupportTicketMessage[];
  relatedBillingEvents?: string[];
  relatedAiRequests?: string[];
  relatedPortfolios?: string[];
}

export interface CannedResponse {
  id: string;
  title: string;
  shortcut: string;
  category: SupportTicketCategory;
  templateText: string;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  slug: string;
  category: SupportTicketCategory;
  summary: string;
  contentMarkdown: string;
  authorName: string;
  viewsCount: number;
  helpfulVotes: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupportAnalyticsMetrics {
  totalTickets: number;
  openCount: number;
  pendingCount: number;
  resolvedCount: number;
  closedCount: number;
  escalatedCount: number;
  urgentCount: number;
  avgResponseTimeMinutes: number;
  avgResolutionTimeHours: number;
  csatPercentage: number;
  agentPerformance: Array<{
    agentId: string;
    agentName: string;
    ticketsResolved: number;
    avgResponseMins: number;
    csatScore: number;
  }>;
  categoryBreakdown: Array<{ category: SupportTicketCategory; count: number }>;
}

export interface TicketDirectoryQuery {
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  plan?: string;
  assignedAgentId?: string;
  page: number;
  limit: number;
}

export interface TicketDirectoryResult {
  tickets: SupportTicket[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  metrics: {
    totalTickets: number;
    openCount: number;
    pendingCount: number;
    resolvedCount: number;
    urgentCount: number;
    slaBreachedCount: number;
  };
}
