import { ConversationSession, ChatMessage, ChatRole } from "../types";
import { TokenManager } from "./token-manager";

export class ConversationManager {
  private static sessions = new Map<string, ConversationSession>();

  public static getOrCreateSession(sessionId: string, userId: string): ConversationSession {
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = {
        sessionId,
        userId,
        messages: [],
        totalTokens: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.sessions.set(sessionId, session);
    }
    return session;
  }

  public static addMessage(
    sessionId: string,
    userId: string,
    role: ChatRole,
    content: string
  ): ChatMessage {
    const session = this.getOrCreateSession(sessionId, userId);
    const tokens = TokenManager.estimateTokenCount(content);

    const message: ChatMessage = {
      id: `msg-${Date.now()}-${session.messages.length + 1}`,
      role,
      content,
      timestamp: new Date().toISOString(),
      tokens
    };

    session.messages.push(message);
    session.totalTokens += tokens;
    session.updatedAt = new Date().toISOString();

    return message;
  }

  public static getHistory(sessionId: string): ChatMessage[] {
    return this.sessions.get(sessionId)?.messages || [];
  }

  public static clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}
