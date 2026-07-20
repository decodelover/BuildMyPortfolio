import { AIValidationStatus } from "../types";

export interface ValidationResult<T = any> {
  status: AIValidationStatus;
  parsedData: T | null;
  warnings: string[];
  errors: string[];
}

export class ResponseValidator {
  public static validateJSON<T = any>(
    jsonText: string,
    requiredKeys: string[] = []
  ): ValidationResult<T> {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!jsonText || jsonText.trim() === "") {
      errors.push("Response body is empty.");
      return { status: "invalid", parsedData: null, warnings, errors };
    }

    let parsed: any = null;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e: any) {
      errors.push(`JSON syntax error: ${e.message}`);
      return { status: "invalid", parsedData: null, warnings, errors };
    }

    if (parsed && typeof parsed === "object") {
      requiredKeys.forEach((key) => {
        if (!(key in parsed) || parsed[key] === undefined || parsed[key] === null) {
          warnings.push(`Expected key '${key}' was missing or null in AI JSON response.`);
        }
      });
    }

    const status: AIValidationStatus = errors.length > 0 ? "invalid" : warnings.length > 0 ? "warning" : "valid";

    return {
      status,
      parsedData: parsed as T,
      warnings,
      errors
    };
  }
}
