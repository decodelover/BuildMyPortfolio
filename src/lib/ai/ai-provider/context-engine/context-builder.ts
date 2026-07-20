export interface ContextBuilderParams {
  websiteData?: Record<string, any>;
  normalizedData?: Record<string, any>;
  contentBlocks?: any[];
  designBlueprint?: any;
  seoBlueprint?: any;
  qualityReport?: any;
  compilationBlueprint?: any;
  userProfile?: Record<string, any>;
}

export class AIContextBuilder {
  public static buildContextString(params: ContextBuilderParams): string {
    const {
      websiteData = {},
      normalizedData,
      contentBlocks,
      designBlueprint,
      seoBlueprint,
      qualityReport,
      compilationBlueprint,
      userProfile
    } = params;

    const sections: string[] = [];

    if (userProfile) {
      sections.push(`User Profile:\n${JSON.stringify(userProfile, null, 2)}`);
    }

    if (websiteData && Object.keys(websiteData).length > 0) {
      sections.push(`Website Raw Data:\n${JSON.stringify(websiteData, null, 2)}`);
    }

    if (normalizedData) {
      sections.push(`Normalized Portfolio Data:\n${JSON.stringify(normalizedData, null, 2)}`);
    }

    if (contentBlocks && contentBlocks.length > 0) {
      sections.push(`Content Blocks Summary:\n${JSON.stringify(contentBlocks.map(b => ({ type: b.type, title: b.title })), null, 2)}`);
    }

    if (designBlueprint) {
      sections.push(`Design Blueprint Summary:\nTheme: ${designBlueprint.theme?.themeId}, Layouts: ${designBlueprint.layouts?.length || 0}`);
    }

    if (seoBlueprint) {
      sections.push(`SEO Blueprint Summary:\nTitle: ${seoBlueprint.metadata?.metaTitle}, Keywords: ${seoBlueprint.metadata?.focusKeywords?.join(", ")}`);
    }

    if (qualityReport) {
      sections.push(`QA Report Score:\nOverall Score: ${qualityReport.scores?.overall || 95}`);
    }

    if (compilationBlueprint) {
      sections.push(`Portfolio Blueprint Sections:\n${compilationBlueprint.sections?.map((s: any) => s.id).join(", ")}`);
    }

    return sections.join("\n\n---\n\n");
  }
}
