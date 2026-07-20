import {
  WorkflowType,
  WorkflowResult,
  WorkflowEventListener
} from "../types";
import { WorkflowRegistry } from "../workflows/workflow-registry";
import { ExecutionPlanner } from "../planner/execution-planner";
import { ExecutionContext } from "../context/execution-context";
import { WorkflowExecutor } from "../services/workflow-executor";
import { OrchestrationSecurity } from "../security/orchestration-security";
import { OrchestrationLogger } from "../logging/orchestration-logger";
import { WorkflowEventBus } from "../events/workflow-event-bus";

export interface RunWorkflowParams {
  workflowId?: WorkflowType;
  userId: string;
  builderId: string;
  planId: string;
  websiteData: Record<string, any>;
  plan: any; // WebsiteGenerationPlan
  onEvent?: WorkflowEventListener;
}

export class OrchestrationEngine {
  public static async executeWorkflow(params: RunWorkflowParams): Promise<WorkflowResult> {
    const {
      workflowId = "portfolio-generation",
      userId,
      builderId,
      planId,
      websiteData,
      plan,
      onEvent
    } = params;

    const executionId = `exec-${planId}-${Date.now()}`;
    const logger = new OrchestrationLogger(builderId);
    const eventBus = WorkflowEventBus.getInstance();

    // Subscribe caller listener if provided
    let unsubscribe: (() => void) | null = null;
    if (onEvent) {
      unsubscribe = eventBus.subscribe("*", onEvent);
    }

    try {
      // 1. Security Check
      OrchestrationSecurity.validateWorkflowRequest(workflowId, userId, builderId, planId, websiteData);

      // 2. Fetch Workflow Definition
      const registry = WorkflowRegistry.getInstance();
      const workflowDef = registry.get(workflowId);

      // 3. Generate Execution Plan (DAG Topological Sorting & Parallel Stage Grouping)
      const executionPlan = ExecutionPlanner.buildExecutionPlan(workflowDef, executionId);

      // 4. Initialize Execution Context
      const context = new ExecutionContext(executionId, userId, builderId, planId, websiteData, plan);

      // 5. Execute Plan
      const result = await WorkflowExecutor.executePlan(executionPlan, context, logger, eventBus);

      return result;

    } finally {
      if (unsubscribe) {
        unsubscribe();
      }
    }
  }
}
