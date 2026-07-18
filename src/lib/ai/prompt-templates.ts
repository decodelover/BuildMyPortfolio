import { PromptTemplate } from "./architect-types";

/**
 * Builds standard parameterized AI-generation prompt templates for the architect plan.
 * These prompts will guide future generative API calls (without making actual API requests now).
 */
export function buildPromptTemplates(): PromptTemplate[] {
  return [
    {
      templateId: "prompt-hero",
      sectionType: "hero",
      systemPrompt: `You are a world-class copywriter specializing in developer portfolios and personal branding.
Generate high-converting hero headlines and short tags that immediately establish credibility.
Match the tone specified by the user exactly. Avoid jargon unless technical context is requested.
Output format must be a raw JSON object:
{
  "headline": "A short bold attention grabber (max 10 words)",
  "subheadline": "A supporting tagline detailing specializations (max 15 words)",
  "ctaText": "Short action label (e.g. 'View Projects', 'Get in Touch')"
}`,
      userPromptTemplate: `Develop website hero copywriting for {{fullName}} who is a {{profession}} specializing in {{specialization}}.
Headline preference: {{headline}}
Employment availability status: {{availability}}
Requested tone: {{tone}}`,
      variablesMap: {
        fullName: "personalInfo.fullName",
        profession: "personalInfo.profession",
        specialization: "personalInfo.specialization",
        headline: "personalInfo.headline",
        availability: "personalInfo.availability",
        tone: "aiBlueprint.contentAnalysis.tone"
      }
    },
    {
      templateId: "prompt-about",
      sectionType: "about",
      systemPrompt: `You are an expert biographer and technical storyteller.
Draft a professional biography that explains the journey, strengths, and vision of the subject.
Make it engaging, readable, and structured. Break details down into logical paragraphs.
Output format must be a raw JSON object:
{
  "title": "Clean heading (e.g., 'My Story')",
  "bioTextParagraphs": ["Paragraph 1 string...", "Paragraph 2 string..."],
  "missionStatement": "A clean one-sentence personal mission statement."
}`,
      userPromptTemplate: `Write a compelling 'About Me' bio for {{fullName}} who has {{yearsOfExperience}} years of experience.
Biographical inputs provided:
- Summary: {{aboutMe}}
- Career Journey: {{journey}}
- Core Values/Passion: {{passion}}
Requested tone: {{tone}}`,
      variablesMap: {
        fullName: "personalInfo.fullName",
        yearsOfExperience: "personalInfo.yearsOfExperience",
        aboutMe: "professionalStory.aboutMe",
        journey: "professionalStory.journey",
        passion: "professionalStory.passion",
        tone: "aiBlueprint.contentAnalysis.tone"
      }
    },
    {
      templateId: "prompt-services",
      sectionType: "services",
      systemPrompt: `You are a pricing strategy expert and SaaS packaging designer.
Refine raw service offers into polished portfolio package highlights that explain deliverables and outcomes.
Output format must be a raw JSON object:
{
  "sectionIntro": "Short 1-2 sentence overview of technical service offerings.",
  "refinedServices": [
    {
      "name": "Refined service name",
      "tagline": "Outcome-focused hook statement (max 12 words)",
      "bulletPoints": ["Deliverable 1", "Deliverable 2"]
    }
  ]
}`,
      userPromptTemplate: `Refine these service list items:
{{servicesJson}}
Requested tone: {{tone}}`,
      variablesMap: {
        servicesJson: "services.services",
        tone: "aiBlueprint.contentAnalysis.tone"
      }
    },
    {
      templateId: "prompt-projects",
      sectionType: "projects",
      systemPrompt: `You are a technical product manager and developer advocate.
Write concise, high-impact case study summaries for completed projects.
Structure it to show: Problem, Technical Solution, and Measurable Outcome.
Output format must be a raw JSON object:
{
  "refinedProjects": [
    {
      "name": "Project Name",
      "problemStatement": "What was the challenge?",
      "solutionStatement": "How did the author build/solve it?",
      "outcomeStatement": "Measurable results, metrics, or performance gains."
    }
  ]
}`,
      userPromptTemplate: `Write case studies for these project details:
{{projectsJson}}
Requested tone: {{tone}}`,
      variablesMap: {
        projectsJson: "projects.projects",
        tone: "aiBlueprint.contentAnalysis.tone"
      }
    }
  ];
}
