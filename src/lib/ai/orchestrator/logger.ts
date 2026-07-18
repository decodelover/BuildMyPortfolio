import { AgentId, GenerationLogEntry } from "./types";

export class StructuredLogger {
  private logs: GenerationLogEntry[] = [];
  
  constructor(private readonly jobId?: string) {}

  public log(level: GenerationLogEntry["level"], message: string, agentId?: AgentId, data?: Record<string, any>): GenerationLogEntry {
    const entry: GenerationLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      agentId,
      data
    };
    
    this.logs.push(entry);

    const logPrefix = `[Orchestrator${this.jobId ? ` | ${this.jobId.slice(0, 8)}` : ""}]`;
    const agentPrefix = agentId ? `[Agent: ${agentId}]` : "";
    const dataString = data ? ` | Data: ${JSON.stringify(data)}` : "";

    switch (level) {
      case "error":
        console.error(`${logPrefix}${agentPrefix} ❌ ERROR: ${message}${dataString}`);
        break;
      case "warn":
        console.warn(`${logPrefix}${agentPrefix} ⚠️ WARNING: ${message}${dataString}`);
        break;
      case "debug":
        console.debug(`${logPrefix}${agentPrefix} 🔍 DEBUG: ${message}${dataString}`);
        break;
      default:
        console.log(`${logPrefix}${agentPrefix} ℹ️ INFO: ${message}${dataString}`);
    }

    return entry;
  }

  public info(message: string, agentId?: AgentId, data?: Record<string, any>): GenerationLogEntry {
    return this.log("info", message, agentId, data);
  }

  public warn(message: string, agentId?: AgentId, data?: Record<string, any>): GenerationLogEntry {
    return this.log("warn", message, agentId, data);
  }

  public error(message: string, agentId?: AgentId, data?: Record<string, any>): GenerationLogEntry {
    return this.log("error", message, agentId, data);
  }

  public debug(message: string, agentId?: AgentId, data?: Record<string, any>): GenerationLogEntry {
    return this.log("debug", message, agentId, data);
  }

  public getLogs(): GenerationLogEntry[] {
    return [...this.logs];
  }

  public clear(): void {
    this.logs = [];
  }
}
