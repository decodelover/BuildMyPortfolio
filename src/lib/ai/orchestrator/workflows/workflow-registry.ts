import { WorkflowDefinition, WorkflowType } from "../types";
import {
  PORTFOLIO_GENERATION_WORKFLOW,
  THEME_CHANGE_WORKFLOW,
  SEO_REFRESH_WORKFLOW,
  CONTENT_REFRESH_WORKFLOW
} from "./workflow-definition";
import { WorkflowNotFoundError } from "../errors/orchestration-errors";

export class WorkflowRegistry {
  private static instance: WorkflowRegistry | null = null;
  private workflows = new Map<WorkflowType, WorkflowDefinition>();

  private constructor() {
    this.registerDefaults();
  }

  public static getInstance(): WorkflowRegistry {
    if (!WorkflowRegistry.instance) {
      WorkflowRegistry.instance = new WorkflowRegistry();
    }
    return WorkflowRegistry.instance;
  }

  private registerDefaults(): void {
    this.register(PORTFOLIO_GENERATION_WORKFLOW);
    this.register(THEME_CHANGE_WORKFLOW);
    this.register(SEO_REFRESH_WORKFLOW);
    this.register(CONTENT_REFRESH_WORKFLOW);
  }

  public register(workflow: WorkflowDefinition): void {
    this.workflows.set(workflow.workflowId, workflow);
  }

  public get(workflowId: WorkflowType): WorkflowDefinition {
    const wf = this.workflows.get(workflowId);
    if (!wf) {
      throw new WorkflowNotFoundError(workflowId);
    }
    return wf;
  }

  public has(workflowId: WorkflowType): boolean {
    return this.workflows.has(workflowId);
  }

  public getAll(): WorkflowDefinition[] {
    return Array.from(this.workflows.values());
  }

  public clear(): void {
    this.workflows.clear();
    this.registerDefaults();
  }
}
