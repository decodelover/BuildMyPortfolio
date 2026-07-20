import { AIResponseParsingError } from "../errors/ai-provider-errors";

export class ResponseParser {
  public static cleanMarkdownFences(text: string): string {
    if (!text) return "";
    let cleaned = text.trim();
    // Remove ```json ... ``` or ``` ... ``` wrappers
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
    }
    return cleaned.trim();
  }

  public static parseJSON<T = any>(rawText: string, providerName: string = "gemini"): T {
    const cleaned = this.cleanMarkdownFences(rawText);
    try {
      return JSON.parse(cleaned) as T;
    } catch (err: any) {
      throw new AIResponseParsingError(
        `Failed to parse structured JSON response from ${providerName}: ${err.message}`,
        providerName,
        { rawText, cleanedText: cleaned }
      );
    }
  }
}
