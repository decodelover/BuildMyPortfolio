import { BuildValidationError } from "../errors/publishing-errors";

export class BuildValidator {
  public static validateBlueprintBuild(blueprintInput: any): void {
    if (!blueprintInput) {
      throw new BuildValidationError("Blueprint build payload is null or undefined.");
    }
    const hasSections = Array.isArray(blueprintInput.sections) && blueprintInput.sections.length > 0;
    const hasPages = Array.isArray(blueprintInput.pages) && blueprintInput.pages.length > 0;

    if (!hasSections && !hasPages) {
      throw new BuildValidationError("Build validation failed: Blueprint contains no sections or pages to publish.");
    }
  }
}
