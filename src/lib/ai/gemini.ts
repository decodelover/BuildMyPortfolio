import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIBlueprint } from "./types";

const apiKey = process.env.GEMINI_API_KEY;

/**
 * Initializes and returns the Gemini generative model.
 */
function getGeminiModel() {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in the server environment variables");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });
}

/**
 * Generates an intelligent website blueprint based on the wizard's steps data (1-13).
 * @param websiteData The structured object containing data from steps 1-13.
 * @returns The parsed AIBlueprint object.
 */
export async function generateBlueprint(websiteData: Record<string, any>): Promise<AIBlueprint> {
  const model = getGeminiModel();

  // Construct a prompt summarizing the input wizard data
  const personal = websiteData.personalInfo || {};
  const business = websiteData.businessIdentity || {};
  const story = websiteData.professionalStory || {};
  const services = websiteData.services?.services || [];
  const projects = websiteData.projects?.projects || [];
  const experience = websiteData.experience?.experience || [];
  const eduData = websiteData.education || {};
  const education = eduData.education || [];
  const certifications = eduData.certifications || [];
  const awards = eduData.awards || [];
  const skills = websiteData.skills || {};
  const testimonials = websiteData.testimonials?.testimonials || [];
  const socials = websiteData.socialLinks || {};
  const prefs = websiteData.websitePreferences || {};
  const extraPages = websiteData.extraPages || {};
  const seo = websiteData.seoInfo || {};

  const prompt = `
Analyze the following portfolio details filled out by a user in our website builder wizard.
Your task is to generate a comprehensive, intelligent website blueprint that includes a completeness score, a portfolio summary, a list of recommended pages with priorities, the optimal ordering of sections for their landing page, a content tone analysis, design suggestions, and SEO recommendations.

Here is the wizard data collected from the user:

1. Personal Information:
- Full Name: ${personal.fullName || "Not provided"}
- Headline: ${personal.headline || "Not provided"}
- Profession: ${personal.profession || "Not provided"}
- Specialization: ${personal.specialization || "Not provided"}
- Country/State/City: ${personal.city || ""}, ${personal.state || ""}, ${personal.country || "Not provided"}
- Years of Experience: ${personal.yearsOfExperience || "Not provided"}
- Current Company: ${personal.currentCompany || "Not provided"}
- Employment Status: ${personal.employmentStatus || "Not provided"}
- Availability: ${personal.availability || "Not provided"}
- Spoken Languages: ${personal.spokenLanguages || "Not provided"}
- Email/Phone: ${personal.email || "Not provided"} / ${personal.phone || "Not provided"}

2. Business Identity:
- Brand Name: ${business.brandName || "Not provided"}
- Website Title: ${business.websiteTitle || "Not provided"}
- Website Tagline: ${business.websiteTagline || "Not provided"}
- Mission Statement: ${business.missionStatement || "Not provided"}
- Vision Statement: ${business.visionStatement || "Not provided"}
- Core Values: ${business.coreValues || "Not provided"}
- Motto/Pitch: ${business.personalMotto || ""} / ${business.elevatorPitch || "Not provided"}

3. Professional Story:
- About Me: ${story.aboutMe || "Not provided"}
- Career Journey: ${story.journey || "Not provided"}
- Passion: ${story.passion || "Not provided"}

4. Services Offered:
${services.map((s: any) => `- Name: ${s.name}, Category: ${s.category || ""}, Price: ${s.startingPrice || ""}, Short Desc: ${s.shortDesc}`).join("\n") || "No services listed."}

5. Projects Completed:
${projects.map((p: any) => `- Name: ${p.name}, Summary: ${p.summary}, Technologies: ${p.technologies || ""}, Featured: ${p.isFeatured ? "Yes" : "No"}`).join("\n") || "No projects listed."}

6. Work Experience Timeline:
${experience.map((e: any) => `- Company: ${e.company}, Position: ${e.position}, Duration: ${e.startDate} to ${e.currentlyWorking ? "Present" : e.endDate || ""}`).join("\n") || "No work history listed."}

7. Education & Academic Background:
- Education: ${education.map((e: any) => `${e.degree} at ${e.school}`).join(", ") || "No education listed."}
- Certifications: ${certifications.map((c: any) => `${c.name} issued by ${c.issuer}`).join(", ") || "No certifications listed."}
- Awards: ${awards.map((a: any) => a.title).join(", ") || "No awards listed."}

8. Core Skills & Technology Capability:
- Frontend: ${skills.frontend?.map((s: any) => s.name).join(", ") || "None"}
- Backend: ${skills.backend?.map((s: any) => s.name).join(", ") || "None"}
- Programming Languages: ${skills.programmingLanguages?.map((s: any) => s.name).join(", ") || "None"}
- Cloud/Devops: ${skills.cloud?.map((s: any) => s.name).join(", ") || "None"}, ${skills.devops?.map((s: any) => s.name).join(", ") || "None"}
- Databases: ${skills.databases?.map((s: any) => s.name).join(", ") || "None"}
- Tools & Frameworks: ${skills.frameworks?.map((s: any) => s.name).join(", ") || "None"}, ${skills.tools?.map((s: any) => s.name).join(", ") || "None"}
- Soft Skills: ${skills.softSkills?.map((s: any) => s.name).join(", ") || "None"}

9. Client Testimonials:
${testimonials.map((t: any) => `- Client: ${t.clientName}, Review: "${t.review.slice(0, 100)}..."`).join("\n") || "No testimonials added."}

10. Connected Social Links:
${Object.keys(socials).filter(k => socials[k]).map(k => `- ${k}: ${socials[k]}`).join("\n") || "No social profiles connected."}

11. Website Layout & Theme Preferences:
- Configured Theme: ${prefs.theme || "minimal"}
- Navigation: ${prefs.navigationStyle || "Top Navbar"}
- Header/Footer Style: ${prefs.headerLayout || "Centered Hero"} / ${prefs.footerLayout || "Simple Copyright"}
- Font: ${prefs.typography || "Sans-serif (Inter)"}
- Palette: ${prefs.colorPalette || "Nordic Minimalist"}

12. Extra Pages Selected:
${Object.keys(extraPages).filter(k => extraPages[k] === true).map(k => `- ${k} Page`).join("\n") || "Only main page active."}

13. SEO Information:
- Meta Title: ${seo.metaTitle || "Not provided"}
- Meta Description: ${seo.metaDescription || "Not provided"}
- Google Analytics: ${seo.googleAnalyticsId || "Not provided"}

Based on this information, return a JSON object adhering exactly to this structure:
{
  "overallScore": number (value between 0 and 100 reflecting the depth/quality of details provided across all steps),
  "summary": string (a concise 2-3 sentence executive summary of the developer's brand, target audience, and positioning),
  "recommendedPages": [
    {
      "name": string (e.g. "Home", "Projects", "Services", "About Me", "Contact"),
      "slug": string (e.g. "/", "/projects", "/services", "/about", "/contact"),
      "priority": "essential" | "recommended" | "optional" (based on their profession, services, and extraPages selection),
      "description": string (the purpose and focus of this page for their brand)
    }
  ],
  "sectionOrder": [
    {
      "section": string (e.g. "Hero Header", "About Summary", "Services Spotlight", "Featured Projects", "Skills Grid", "Experience Timeline", "Testimonials Carousel", "Contact Action"),
      "reason": string (a short explanation of why this section should be ordered here to maximize visitor engagement and conversion)
    }
  ],
  "contentAnalysis": {
    "tone": string (e.g. "Modern & Technical", "Professional & Formal", "Creative & Expressive"),
    "strengths": [string] (list of strengths in their current input content),
    "improvements": [string] (list of improvements to make their content more copy-ready or persuasive)
  },
  "designRecommendations": {
    "colorSuggestion": string (color scheme advice that fits their profession and theme preference),
    "typographySuggestion": string (font selection advice),
    "layoutSuggestion": string (specific layout configuration advice)
  },
  "seoRecommendations": {
    "titleSuggestion": string (optimized title format for their brand/profession),
    "descriptionSuggestion": string (a copy-pasteable meta description template),
    "keywords": [string] (relevant search terms)
  },
  "missingDataWarnings": [string] (warnings for any steps or fields that are blank but highly critical, e.g. "Missing custom projects - add at least 2 real-world projects to showcase your capability.")
}

Return ONLY this valid JSON object, with no extra wrapping text, no markdown block wrappers, or other formatting.
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Parse the output string safely
    const parsed: AIBlueprint = JSON.parse(text.trim());
    return parsed;
  } catch (error: any) {
    console.error("Gemini API call or parsing failed:", error);
    throw new Error(`Failed to compile AI website blueprint: ${error.message || "Unknown error"}`);
  }
}
