import { StreamChunk, StreamProgressCallback, TokenUsage } from "../types";
import { TokenManager } from "./token-manager";

export class StreamingEngine {
  public static async processStream(
    stream: AsyncIterable<{ text: () => string }>,
    requestId: string,
    model: string,
    promptText: string,
    onProgress?: StreamProgressCallback
  ): Promise<{ fullText: string; tokens: TokenUsage }> {
    let accumulatedText = "";

    for await (const chunk of stream) {
      const chunkText = chunk.text();
      accumulatedText += chunkText;

      const event: StreamChunk = {
        requestId,
        chunkText,
        accumulatedText,
        isFinished: false
      };

      if (onProgress) {
        onProgress(event);
      }
    }

    const tokens = TokenManager.createTokenUsage(model, promptText, accumulatedText);

    const finalEvent: StreamChunk = {
      requestId,
      chunkText: "",
      accumulatedText,
      isFinished: true,
      tokens
    };

    if (onProgress) {
      onProgress(finalEvent);
    }

    return {
      fullText: accumulatedText,
      tokens
    };
  }
}
