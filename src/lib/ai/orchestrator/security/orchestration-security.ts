import { WorkflowType } from "../types";
import { OrchestrationError } from "../errors/orchestration-errors";

export class OrchestrationSecurity {
  public static validateWorkflowRequest(
    workflowId: WorkflowType,
    userId: string,
    builderId: string,
    planId: string,
    websiteData: Record<string, any>
  ): void {
    if (!userId || typeof userId !== "string") {
      throw new OrchestrationError("Workflow request rejected: userId is required.", "UNAUTHORIZED_WORKFLOW");
    }
    if (!builderId || typeof builderId !== "string") {
      throw new OrchestrationError("Workflow request rejected: builderId is required.", "INVALID_BUILDER_ID");
    }
    if (!planId || typeof planId !== "string") {
      throw new OrchestrationError("Workflow request rejected: planId is required.", "INVALID_PLAN_ID");
    }
    if (!websiteData || typeof websiteData !== "object") {
      throw new OrchestrationError("Workflow request rejected: websiteData must be a valid payload object.", "INVALID_WEBSITE_DATA");
    }
  }
}
