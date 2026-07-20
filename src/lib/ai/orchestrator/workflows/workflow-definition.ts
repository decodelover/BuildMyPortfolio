import { WorkflowDefinition } from "../types";

export const PORTFOLIO_GENERATION_WORKFLOW: WorkflowDefinition = {
  workflowId: "portfolio-generation",
  name: "Full Portfolio Generation Workflow",
  description: "Executes full multi-agent generation sequence: Parallel Content & Design -> SEO -> QA -> Portfolio Compilation Engine.",
  version: "1.0.0",
  tasks: [
    {
      id: "task-content",
      name: "Content Generation Agent",
      agentId: "content",
      dependencies: [],
      priority: 10,
      timeoutMs: 60000,
      allowParallel: true
    },
    {
      id: "task-design",
      name: "Design & Theme Agent",
      agentId: "design",
      dependencies: [],
      priority: 10,
      timeoutMs: 60000,
      allowParallel: true
    },
    {
      id: "task-seo",
      name: "SEO Metadata & Schema Agent",
      agentId: "seo",
      dependencies: ["task-content", "task-design"],
      priority: 20,
      timeoutMs: 45000,
      allowParallel: false
    },
    {
      id: "task-qa",
      name: "Quality Assurance Agent",
      agentId: "qa",
      dependencies: ["task-content", "task-design", "task-seo"],
      priority: 30,
      timeoutMs: 45000,
      allowParallel: false
    },
    {
      id: "task-compiler",
      name: "Portfolio Compilation Engine Agent",
      agentId: "compiler",
      dependencies: ["task-content", "task-design", "task-seo", "task-qa"],
      priority: 40,
      timeoutMs: 60000,
      allowParallel: false
    }
  ]
};

export const THEME_CHANGE_WORKFLOW: WorkflowDefinition = {
  workflowId: "theme-change",
  name: "Targeted Theme Change Workflow",
  description: "Executes rapid design recalculation & recompilation.",
  version: "1.0.0",
  tasks: [
    {
      id: "task-design",
      name: "Design & Theme Agent",
      agentId: "design",
      dependencies: [],
      priority: 10,
      timeoutMs: 45000,
      allowParallel: false
    },
    {
      id: "task-compiler",
      name: "Portfolio Compilation Engine Agent",
      agentId: "compiler",
      dependencies: ["task-design"],
      priority: 20,
      timeoutMs: 45000,
      allowParallel: false
    }
  ]
};

export const SEO_REFRESH_WORKFLOW: WorkflowDefinition = {
  workflowId: "seo-refresh",
  name: "Targeted SEO Refresh Workflow",
  description: "Re-analyzes content SEO, updates structured data schemas, and re-compiles blueprint.",
  version: "1.0.0",
  tasks: [
    {
      id: "task-seo",
      name: "SEO Metadata & Schema Agent",
      agentId: "seo",
      dependencies: [],
      priority: 10,
      timeoutMs: 45000,
      allowParallel: false
    },
    {
      id: "task-compiler",
      name: "Portfolio Compilation Engine Agent",
      agentId: "compiler",
      dependencies: ["task-seo"],
      priority: 20,
      timeoutMs: 45000,
      allowParallel: false
    }
  ]
};

export const CONTENT_REFRESH_WORKFLOW: WorkflowDefinition = {
  workflowId: "content-refresh",
  name: "Content Refresh Workflow",
  description: "Re-generates portfolio content blocks, audits quality, and compiles updated blueprint.",
  version: "1.0.0",
  tasks: [
    {
      id: "task-content",
      name: "Content Generation Agent",
      agentId: "content",
      dependencies: [],
      priority: 10,
      timeoutMs: 60000,
      allowParallel: false
    },
    {
      id: "task-qa",
      name: "Quality Assurance Agent",
      agentId: "qa",
      dependencies: ["task-content"],
      priority: 20,
      timeoutMs: 45000,
      allowParallel: false
    },
    {
      id: "task-compiler",
      name: "Portfolio Compilation Engine Agent",
      agentId: "compiler",
      dependencies: ["task-content", "task-qa"],
      priority: 30,
      timeoutMs: 45000,
      allowParallel: false
    }
  ]
};
