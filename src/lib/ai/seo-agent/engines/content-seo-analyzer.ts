import { ContentSeoChecklist, SEOContext, PageMetadata } from "../types";

export class ContentSeoAnalyzer {
  
  public static resolve(context: SEOContext, metadata: PageMetadata): ContentSeoChecklist {
    const personal = context.normalizedData.personal;
    const story = context.normalizedData.story;
    const projects = context.normalizedData.projects || [];
    
    const wordsBio = (personal.bioSummary || "").split(/\s+/).filter(Boolean);
    const wordsStory = (story.backgroundSummary || "").split(/\s+/).filter(Boolean);
    const totalWords = wordsBio.length + wordsStory.length;

    // Check heading hierarchy validity (statically analyze sections present)
    const errors: string[] = [];
    const hasHero = context.rawInput.personalInfo?.fullName;
    if (!hasHero) {
      errors.push("Missing primary H1 tag equivalent.");
    }

    const headingHierarchy = {
      isValid: errors.length === 0,
      issues: errors
    };

    // Calculate keyword densities
    const density: Record<string, number> = {};
    const textBlob = `${personal.bioSummary} ${story.backgroundSummary} ${personal.profession}`.toLowerCase();
    
    const allKeywords = [...metadata.focusKeywords, ...metadata.secondaryKeywords];
    allKeywords.forEach((kw) => {
      if (!kw) return;
      const regex = new RegExp(`\\b${kw.toLowerCase()}\\b`, "g");
      const matches = textBlob.match(regex);
      const occurrences = matches ? matches.length : 0;
      const percentage = totalWords > 0 ? (occurrences / totalWords) * 100 : 0;
      density[kw] = parseFloat(percentage.toFixed(2));
    });

    // Grade scores out of 100
    const sectionStructureScore = context.contentBlocks.length > 5 ? 95 : 75;
    const internalLinkingScore = projects.length > 0 ? 90 : 60;
    const contentLengthScore = totalWords > 200 ? 95 : totalWords > 100 ? 80 : 50;
    const readabilityScore = totalWords > 50 ? 88 : 70;
    const semanticRelevanceIndex = 90;
    const imageAltCoverageScore = personal.avatarUrl ? 100 : 0;
    const freshnessIndex = 95;

    const recommendations: string[] = [];
    if (totalWords < 150) {
      recommendations.push("Increase professional bio text length to at least 150 words for enhanced semantic context.");
    }
    if (projects.length === 0) {
      recommendations.push("Add at least two project items to show experience relevance.");
    }
    if (!personal.avatarUrl) {
      recommendations.push("Upload a profile picture (avatar) to improve visual layout trust signals.");
    }

    return {
      headingHierarchy,
      keywordDensity: density,
      sectionStructureScore,
      internalLinkingScore,
      contentLengthScore,
      duplicateContentWarnings: [],
      readabilityScore,
      semanticRelevanceIndex,
      imageAltCoverageScore,
      freshnessIndex,
      recommendations
    };
  }
}
