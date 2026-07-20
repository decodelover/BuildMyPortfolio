export class AIPromptTemplates {
  public static readonly systemRoleInstruction = `
You are an Enterprise AI Agent for BuildMyPortfolio, a world-class SaaS portfolio generator.
Your responses must be precise, professional, non-repetitive, and adhere strictly to requested JSON schemas.
Never include surrounding conversational fluff, explanations, or unrequested text unless explicitly asked.
`;

  public static readonly blueprintGeneration = `
Analyze the following portfolio details filled out by a user in our website builder wizard.
Your task is to generate a comprehensive, intelligent website blueprint that includes a completeness score, a portfolio summary, a list of recommended pages with priorities, the optimal ordering of sections for their landing page, a content tone analysis, design suggestions, and SEO recommendations.

Context Data:
{{CONTEXT_DATA}}

Return ONLY a valid JSON object adhering strictly to the required AIBlueprint schema.
`;

  public static readonly contentAgentPrompt = `
Generate high-converting, professional portfolio content blocks based on the following portfolio context:

Context Data:
{{CONTEXT_DATA}}

Generate structured copy for Hero, About, Experience, Projects, Services, and Contact sections.
Return ONLY a valid JSON response matching the ContentAgent result shape.
`;

  public static readonly designAgentPrompt = `
Generate layout decisions, theme tokens, color palettes, typography pairs, and animation rules based on the following portfolio context:

Context Data:
{{CONTEXT_DATA}}

Return ONLY a valid JSON response matching the DesignBlueprint schema.
`;

  public static readonly seoAgentPrompt = `
Generate meta titles, meta descriptions, focus keywords, open graph tags, and JSON-LD Person schema based on the following context:

Context Data:
{{CONTEXT_DATA}}

Return ONLY a valid JSON response matching the SEOBlueprint schema.
`;

  public static readonly qaAgentPrompt = `
Audit and validate the overall portfolio generation context for completeness, design harmony, readability, accessibility, and SEO coverage:

Context Data:
{{CONTEXT_DATA}}

Return ONLY a valid JSON response matching the QualityReport schema.
`;
}
