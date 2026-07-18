export class SeoAgentConfig {
  public static readonly maxTitleLength = 60;
  public static readonly minTitleLength = 30;

  public static readonly maxDescriptionLength = 160;
  public static readonly minDescriptionLength = 70;

  public static readonly maxKeywordsCount = 10;
  
  public static readonly defaultRobotsPolicy = {
    index: true,
    follow: true,
    googleBot: "index, follow, max-image-preview:large, max-snippet:-1"
  };

  public static readonly scoringWeights = {
    metadata: 0.15,
    content: 0.15,
    technical: 0.10,
    structuredData: 0.15,
    accessibility: 0.10,
    performance: 0.05,
    socialSharing: 0.10,
    urlStructure: 0.10,
    readability: 0.05,
    keywordOptimization: 0.05
  };
}
