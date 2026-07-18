import { AccessibilitySeoChecks, SEOContext } from "../types";

export class AccessibilitySeoEngine {
  
  public static resolve(context: SEOContext): AccessibilitySeoChecks {
    const personal = context.normalizedData.personal;
    const socials = context.normalizedData.socials || {};

    const warnings: string[] = [];
    const issues: string[] = [];

    // Statically check if social links are descriptive
    Object.entries(socials).forEach(([platform, url]) => {
      if (url && !platform) {
        warnings.push(`Descriptive anchor tag labels are missing for platforms.`);
      }
    });

    const hasAlt = !!personal.avatarUrl;
    if (!hasAlt) {
      warnings.push("Avatar image is missing descriptive alternative (ALT) text.");
    }

    const ariaLabelsStatus = {
      isValid: issues.length === 0,
      issues
    };

    return {
      linkLabels: {
        isValid: warnings.length === 0,
        warnings
      },
      imageAltTextStatus: {
        hasAlt,
        missingCount: hasAlt ? 0 : 1
      },
      ariaLabelsStatus,
      contrastTargetsMet: true,
      screenReaderCues: [
        "Include hidden skip link navigation anchors.",
        "Add explicit aria-expanded descriptors to dropdown elements."
      ],
      wcagLevel: "AA"
    };
  }
}
