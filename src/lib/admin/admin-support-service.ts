import { AdminRbacEngine } from "./admin-rbac-engine";
import { AdminUserService } from "./admin-user-service";
import {
  SupportTicket,
  TicketDirectoryQuery,
  TicketDirectoryResult,
  KnowledgeBaseArticle,
  CannedResponse,
  SupportAnalyticsMetrics,
  SupportTicketPriority,
  SupportTicketStatus,
} from "@/types/admin-support";

const MOCK_TICKETS_SEED: SupportTicket[] = [
  {
    id: "tkt_801",
    subject: "Custom Domain SSL Certificate Provisioning Failed for alexmorgan.dev",
    description: "I mapped my custom domain alexmorgan.dev to my portfolio subdomain, but the SSL certificate status has been pending for over 6 hours.",
    customerId: "usr_101",
    customerName: "Alex Morgan",
    customerEmail: "alex.morgan@example.com",
    customerPlan: "PRO",
    priority: "HIGH",
    status: "OPEN",
    category: "CUSTOM_DOMAIN",
    assignedAgentId: "agent_201",
    assignedAgentName: "Sarah Jenkins (Senior Support)",
    responseSlaBreached: false,
    resolutionSlaBreached: false,
    createdAt: "2026-07-23T01:10:00Z",
    updatedAt: "2026-07-23T02:00:00Z",
    messages: [
      {
        id: "msg_1",
        ticketId: "tkt_801",
        senderId: "usr_101",
        senderName: "Alex Morgan",
        senderType: "customer",
        messageText: "Hi team, my custom domain SSL certificate seems stuck in pending validation. Could you please check DNS records on your end?",
        isInternalNote: false,
        timestamp: "2026-07-23T01:10:00Z",
      },
      {
        id: "msg_2",
        ticketId: "tkt_801",
        senderId: "agent_201",
        senderName: "Sarah Jenkins",
        senderType: "agent",
        messageText: "Checked Cloudflare SSL edge cert for alexmorgan.dev — DNS CNAME target is correct. Re-triggered certificate challenge.",
        isInternalNote: true,
        timestamp: "2026-07-23T02:00:00Z",
      },
    ],
    relatedPortfolios: ["fol_101"],
  },
  {
    id: "tkt_802",
    subject: "Upgrade to BUSINESS Plan Invoice Breakdown & VAT Receipt Request",
    description: "Need an official tax invoice with VAT ID for my company TechSolutions Inc.",
    customerId: "usr_102",
    customerName: "Sarah Chen",
    customerEmail: "sarah.c@techsolutions.io",
    customerPlan: "BUSINESS",
    priority: "NORMAL",
    status: "PENDING",
    category: "BILLING",
    assignedAgentId: "agent_202",
    assignedAgentName: "David Miller (Finance Ops)",
    responseSlaBreached: false,
    resolutionSlaBreached: false,
    createdAt: "2026-07-22T15:30:00Z",
    updatedAt: "2026-07-22T16:00:00Z",
    messages: [
      {
        id: "msg_3",
        ticketId: "tkt_802",
        senderId: "usr_102",
        senderName: "Sarah Chen",
        senderType: "customer",
        messageText: "Hello, please issue an updated PDF invoice reflecting our VAT registration number EU94820194.",
        isInternalNote: false,
        timestamp: "2026-07-22T15:30:00Z",
      },
    ],
    relatedBillingEvents: ["inv_9041"],
  },
  {
    id: "tkt_803",
    subject: "Compiler Agent AI Request Limit Exceeded during Portfolio Generation",
    description: "Encountered 429 rate limit during high-res asset compile.",
    customerId: "usr_104",
    customerName: "Elena Rostova",
    customerEmail: "elena.rostova@designstudio.de",
    customerPlan: "PRO",
    priority: "URGENT",
    status: "OPEN",
    category: "AI_GENERATION",
    assignedAgentId: "agent_201",
    assignedAgentName: "Sarah Jenkins (Senior Support)",
    responseSlaBreached: true,
    resolutionSlaBreached: false,
    createdAt: "2026-07-22T18:00:00Z",
    updatedAt: "2026-07-22T18:00:00Z",
    messages: [
      {
        id: "msg_4",
        ticketId: "tkt_803",
        senderId: "usr_104",
        senderName: "Elena Rostova",
        senderType: "customer",
        messageText: "Compiler Agent timed out when generating CSS variables. Please check request logs.",
        isInternalNote: false,
        timestamp: "2026-07-22T18:00:00Z",
      },
    ],
    relatedAiRequests: ["req_701"],
  },
];

const MOCK_KB_ARTICLES: KnowledgeBaseArticle[] = [
  {
    id: "kb_101",
    title: "How to Map a Custom Domain to Your Portfolio",
    slug: "how-to-map-custom-domain",
    category: "CUSTOM_DOMAIN",
    summary: "Step-by-step instructions for configuring DNS CNAME and A records with Cloudflare, Namecheap, and GoDaddy.",
    contentMarkdown: "### Custom Domain Setup Guide\n\n1. Go to **Dashboard > Settings > Domains**\n2. Add your custom domain (e.g., `portfolio.yourname.com`).\n3. Configure CNAME record to `cname.buildmyportfolio.com`.",
    authorName: "Sarah Jenkins",
    viewsCount: 4200,
    helpfulVotes: 380,
    isPublished: true,
    createdAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-06-15T12:00:00Z",
  },
  {
    id: "kb_102",
    title: "Understanding AI Generation Quotas & Rate Limits",
    slug: "understanding-ai-quotas",
    category: "AI_GENERATION",
    summary: "Details on monthly AI generation tokens, prompt compiler usage, and plan tier limits.",
    contentMarkdown: "### AI Tokens & Quota Allocation\n\n- **FREE Plan**: 1,000 AI tokens / mo\n- **PRO Plan**: 50,000 AI tokens / mo\n- **BUSINESS Plan**: 250,000 AI tokens / mo",
    authorName: "Alex Morgan",
    viewsCount: 2900,
    helpfulVotes: 240,
    isPublished: true,
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-07-01T12:00:00Z",
  },
];

const MOCK_CANNED_RESPONSES: CannedResponse[] = [
  {
    id: "cn_1",
    title: "Custom Domain DNS Verification",
    shortcut: "/ssl-fix",
    category: "CUSTOM_DOMAIN",
    templateText: "Hello {customerName},\n\nWe have re-triggered the SSL certificate issuance for {customDomain}. Please ensure your DNS CNAME record points to cname.buildmyportfolio.com. It usually propagates within 15 minutes.\n\nBest regards,\nBuildMyPortfolio Support Team",
  },
  {
    id: "cn_2",
    title: "Billing Invoice Request",
    shortcut: "/invoice-tax",
    category: "BILLING",
    templateText: "Hello {customerName},\n\nYour official tax invoice with VAT ID details has been re-generated and is attached to this ticket. You can also view it anytime under Dashboard > Billing.\n\nBest regards,\nBuildMyPortfolio Billing Team",
  },
];

export class AdminSupportService {
  private static ticketsStore: SupportTicket[] = [...MOCK_TICKETS_SEED];
  private static kbArticlesStore: KnowledgeBaseArticle[] = [...MOCK_KB_ARTICLES];
  private static cannedResponsesStore: CannedResponse[] = [...MOCK_CANNED_RESPONSES];

  private static logSupportAudit(
    adminRole: string,
    adminId: string,
    action: string,
    details: string,
    targetId: string,
    previousValue?: any,
    newValue?: any,
    ipAddress: string = "127.0.0.1"
  ) {
    return AdminUserService.logAudit(
      adminRole,
      adminId,
      `SUPPORT_${action}`,
      details,
      targetId,
      undefined,
      previousValue,
      newValue,
      ipAddress
    );
  }

  // Query Tickets Directory
  public static async getTickets(query: TicketDirectoryQuery): Promise<TicketDirectoryResult> {
    let filtered = [...this.ticketsStore];

    if (query.search && query.search.trim()) {
      const q = query.search.toLowerCase().trim();
      filtered = filtered.filter(
        (t) =>
          t.subject.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          t.customerEmail.toLowerCase().includes(q)
      );
    }

    if (query.status && query.status !== "ALL") {
      filtered = filtered.filter((t) => t.status.toUpperCase() === query.status?.toUpperCase());
    }

    if (query.priority && query.priority !== "ALL") {
      filtered = filtered.filter((t) => t.priority.toUpperCase() === query.priority?.toUpperCase());
    }

    if (query.category && query.category !== "ALL") {
      filtered = filtered.filter((t) => t.category.toUpperCase() === query.category?.toUpperCase());
    }

    if (query.plan && query.plan !== "ALL") {
      filtered = filtered.filter((t) => t.customerPlan.toUpperCase() === query.plan?.toUpperCase());
    }

    const total = filtered.length;
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, query.limit || 10);
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    const metrics = {
      totalTickets: this.ticketsStore.length,
      openCount: this.ticketsStore.filter((t) => t.status === "OPEN").length,
      pendingCount: this.ticketsStore.filter((t) => t.status === "PENDING").length,
      resolvedCount: this.ticketsStore.filter((t) => t.status === "RESOLVED").length,
      urgentCount: this.ticketsStore.filter((t) => t.priority === "URGENT" || t.priority === "CRITICAL").length,
      slaBreachedCount: this.ticketsStore.filter((t) => t.responseSlaBreached || t.resolutionSlaBreached).length,
    };

    return { tickets: paginated, total, page, limit, totalPages, metrics };
  }

  // Get Ticket 360
  public static async getTicketById(ticketId: string): Promise<SupportTicket | null> {
    const tkt = this.ticketsStore.find((t) => t.id === ticketId);
    return tkt ? { ...tkt } : null;
  }

  // Reply to Ticket or Add Internal Note
  public static async replyToTicket(
    adminRole: string,
    adminId: string,
    ticketId: string,
    messageText: string,
    isInternalNote: boolean = false,
    ipAddress?: string
  ) {
    if (!AdminRbacEngine.canManageSupport(adminRole)) throw new Error("Forbidden.");
    const tkt = this.ticketsStore.find((t) => t.id === ticketId);
    if (!tkt) throw new Error("Ticket not found.");

    const newMessage = {
      id: `msg_${Date.now()}`,
      ticketId,
      senderId: adminId,
      senderName: "Support Agent",
      senderType: "agent" as const,
      messageText,
      isInternalNote,
      timestamp: new Date().toISOString(),
    };

    tkt.messages.push(newMessage);
    tkt.updatedAt = new Date().toISOString();
    if (!isInternalNote) {
      tkt.status = "WAITING_FOR_CUSTOMER";
    }

    this.logSupportAudit(
      adminRole,
      adminId,
      isInternalNote ? "ADD_INTERNAL_NOTE" : "REPLY",
      `${isInternalNote ? "Added internal note to" : "Replied to"} ticket ${ticketId}`,
      ticketId,
      undefined,
      newMessage,
      ipAddress
    );

    return { success: true, ticket: { ...tkt } };
  }

  // Assign Ticket
  public static async assignTicket(adminRole: string, adminId: string, ticketId: string, agentId: string, agentName: string, ipAddress?: string) {
    if (!AdminRbacEngine.canManageSupport(adminRole)) throw new Error("Forbidden.");
    const tkt = this.ticketsStore.find((t) => t.id === ticketId);
    if (!tkt) throw new Error("Ticket not found.");

    const prevAgent = tkt.assignedAgentName;
    tkt.assignedAgentId = agentId;
    tkt.assignedAgentName = agentName;
    tkt.updatedAt = new Date().toISOString();

    this.logSupportAudit(adminRole, adminId, "ASSIGN", `Assigned ticket ${ticketId} to ${agentName}`, ticketId, prevAgent, agentName, ipAddress);

    return { success: true, ticket: { ...tkt } };
  }

  // Change Status
  public static async updateTicketStatus(adminRole: string, adminId: string, ticketId: string, status: SupportTicketStatus, ipAddress?: string) {
    if (!AdminRbacEngine.canManageSupport(adminRole)) throw new Error("Forbidden.");
    const tkt = this.ticketsStore.find((t) => t.id === ticketId);
    if (!tkt) throw new Error("Ticket not found.");

    const prevStatus = tkt.status;
    tkt.status = status;
    if (status === "RESOLVED") tkt.resolvedAt = new Date().toISOString();
    tkt.updatedAt = new Date().toISOString();

    this.logSupportAudit(adminRole, adminId, "STATUS_CHANGE", `Updated ticket ${ticketId} status to ${status}`, ticketId, prevStatus, status, ipAddress);

    return { success: true, ticket: { ...tkt } };
  }

  // KB Articles & Canned Responses
  public static async getKnowledgeBaseArticles(): Promise<KnowledgeBaseArticle[]> {
    return [...this.kbArticlesStore];
  }

  public static async getCannedResponses(): Promise<CannedResponse[]> {
    return [...this.cannedResponsesStore];
  }

  // Support Analytics
  public static async getSupportAnalytics(): Promise<SupportAnalyticsMetrics> {
    return {
      totalTickets: this.ticketsStore.length,
      openCount: this.ticketsStore.filter((t) => t.status === "OPEN").length,
      pendingCount: this.ticketsStore.filter((t) => t.status === "PENDING").length,
      resolvedCount: this.ticketsStore.filter((t) => t.status === "RESOLVED").length,
      closedCount: this.ticketsStore.filter((t) => t.status === "CLOSED").length,
      escalatedCount: this.ticketsStore.filter((t) => t.status === "ESCALATED").length,
      urgentCount: this.ticketsStore.filter((t) => t.priority === "URGENT" || t.priority === "CRITICAL").length,
      avgResponseTimeMinutes: 18,
      avgResolutionTimeHours: 2.4,
      csatPercentage: 98.4,
      agentPerformance: [
        { agentId: "agent_201", agentName: "Sarah Jenkins", ticketsResolved: 142, avgResponseMins: 14, csatScore: 99.1 },
        { agentId: "agent_202", agentName: "David Miller", ticketsResolved: 98, avgResponseMins: 22, csatScore: 97.8 },
      ],
      categoryBreakdown: [
        { category: "CUSTOM_DOMAIN", count: 45 },
        { category: "BILLING", count: 38 },
        { category: "AI_GENERATION", count: 28 },
        { category: "PORTFOLIO_BUILDER", count: 18 },
      ],
    };
  }
}
