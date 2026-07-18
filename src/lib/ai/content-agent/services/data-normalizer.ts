import { PortfolioInputData, NormalizedPortfolioData } from "../types";

export class DataNormalizer {
  
  public static normalize(raw: PortfolioInputData): NormalizedPortfolioData {
    const personalInfo = raw.personalInfo || {};
    const professionalStory = raw.professionalStory || {};
    const skillsSec = raw.skills || {};
    const projectsSec = raw.projects || {};
    const experienceSec = raw.experience || {};
    const educationSec = raw.education || {};
    const servicesSec = raw.services || {};
    const testimonialsSec = raw.testimonials || {};
    const socialsSec = raw.socialLinks || {};
    const preferencesSec = raw.websitePreferences || {};
    const seoSec = raw.seoInfo || {};

    // 1. Normalize Personal Details
    const personal: NormalizedPortfolioData["personal"] = {
      fullName: (personalInfo.fullName || "").trim() || "John Doe",
      profession: (personalInfo.profession || "").trim() || "Software Engineer",
      headline: (personalInfo.headline || "").trim() || "Building clean digital products",
      bioSummary: (personalInfo.bioSummary || "").trim() || "I design, construct and deploy scalable web architectures.",
      email: (personalInfo.email || "").trim().toLowerCase(),
      phone: (personalInfo.phone || "").trim(),
      location: (personalInfo.location || "").trim() || "Remote",
      avatarUrl: personalInfo.avatarUrl ? personalInfo.avatarUrl.trim() : undefined
    };

    // 2. Normalize Career Story
    const yearsExp = parseInt(professionalStory.yearsOfExperience, 10);
    const story: NormalizedPortfolioData["story"] = {
      backgroundSummary: (professionalStory.backgroundSummary || "").trim(),
      careerMilestones: (professionalStory.careerMilestones || [])
        .map((m: any) => (typeof m === "string" ? m.trim() : (m.text || "").trim()))
        .filter((m: string) => m.length > 0),
      coreValues: (professionalStory.coreValues || [])
        .map((v: any) => (typeof v === "string" ? v.trim() : (v.text || "").trim()))
        .filter((v: string) => v.length > 0),
      yearsOfExperience: isNaN(yearsExp) ? 5 : yearsExp
    };

    // 3. Normalize & Deduplicate Skills
    const skillsList = skillsSec.skills || [];
    const skillsMap = new Map<string, { name: string; category: string; level: any }>();
    skillsList.forEach((s: any) => {
      const name = (s.name || "").trim();
      if (name) {
        const key = name.toLowerCase();
        if (!skillsMap.has(key)) {
          skillsMap.set(key, {
            name,
            category: (s.category || "").trim() || "Other",
            level: s.level || "expert"
          });
        }
      }
    });
    const skills = Array.from(skillsMap.values());

    // 4. Normalize & Deduplicate Projects
    const projectsList = projectsSec.projects || [];
    const projectsMap = new Map<string, any>();
    projectsList.forEach((p: any, idx: number) => {
      const title = (p.title || "").trim();
      const desc = (p.description || "").trim();
      if (title) {
        const key = `${title.toLowerCase()}_${desc.slice(0, 10).toLowerCase()}`;
        if (!projectsMap.has(key)) {
          // Normalize tech tags
          const rawTags = p.technologies || [];
          const tags = Array.from(new Set(rawTags.map((t: string) => t.trim()).filter((t: string) => t.length > 0)));

          projectsMap.set(key, {
            id: p.id || `proj-${idx}-${Date.now()}`,
            title,
            description: desc,
            role: (p.role || "").trim() || "Lead Developer",
            technologies: tags,
            liveUrl: p.liveUrl ? p.liveUrl.trim() : undefined,
            githubUrl: p.githubUrl ? p.githubUrl.trim() : undefined,
            imageUrl: p.imageUrl ? p.imageUrl.trim() : undefined,
            featured: !!p.featured
          });
        }
      }
    });
    const projects = Array.from(projectsMap.values());

    // 5. Normalize Experience Records
    const experienceList = experienceSec.experience || [];
    const experience = experienceList.map((exp: any, idx: number) => {
      const rawTags = exp.technologies || [];
      const tags = Array.from(new Set(rawTags.map((t: string) => t.trim()).filter((t: string) => t.length > 0)));

      return {
        id: exp.id || `exp-${idx}-${Date.now()}`,
        company: (exp.company || "").trim(),
        role: (exp.role || "").trim(),
        location: exp.location ? exp.location.trim() : undefined,
        startDate: (exp.startDate || "").trim(),
        endDate: exp.current ? undefined : (exp.endDate || "").trim(),
        current: !!exp.current,
        description: (exp.description || "").trim(),
        technologies: tags
      };
    }).filter((exp: any) => exp.company.length > 0);

    // 6. Normalize Education Records
    const educationList = educationSec.education || [];
    const education = educationList.map((edu: any, idx: number) => ({
      id: edu.id || `edu-${idx}-${Date.now()}`,
      institution: (edu.institution || "").trim(),
      degree: (edu.degree || "").trim(),
      fieldOfStudy: (edu.fieldOfStudy || "").trim(),
      startDate: (edu.startDate || "").trim(),
      endDate: edu.current ? undefined : (edu.endDate || "").trim(),
      current: !!edu.current,
      description: edu.description ? edu.description.trim() : undefined
    })).filter((edu: any) => edu.institution.length > 0);

    // 7. Normalize Services
    const servicesList = servicesSec.services || [];
    const services = servicesList.map((s: any, idx: number) => {
      const rawFeatures = s.features || [];
      const features = rawFeatures.map((f: string) => f.trim()).filter((f: string) => f.length > 0);

      return {
        id: s.id || `srv-${idx}-${Date.now()}`,
        title: (s.title || "").trim(),
        description: (s.description || "").trim(),
        features,
        price: s.price ? s.price.trim() : undefined
      };
    }).filter((s: any) => s.title.length > 0);

    // 8. Normalize Testimonials
    const testimonialsList = testimonialsSec.testimonials || [];
    const testimonials = testimonialsList.map((t: any, idx: number) => ({
      id: t.id || `t-${idx}-${Date.now()}`,
      clientName: (t.clientName || "").trim(),
      clientRole: (t.clientRole || "").trim(),
      clientCompany: t.clientCompany ? t.clientCompany.trim() : undefined,
      feedback: (t.feedback || "").trim(),
      avatarUrl: t.avatarUrl ? t.avatarUrl.trim() : undefined
    })).filter((t: any) => t.clientName.length > 0);

    // 9. Normalize Socials
    const socials: Record<string, string> = {};
    const rawSocials = socialsSec.socials || {};
    Object.keys(rawSocials).forEach((platform) => {
      const val = rawSocials[platform];
      if (val && val.trim()) {
        socials[platform] = val.trim();
      }
    });

    // 10. Normalize Design Preferences
    const preferences: NormalizedPortfolioData["preferences"] = {
      themeId: (preferencesSec.theme || "default-dark").trim(),
      borderRadius: (preferencesSec.borderRadius || "8px").trim(),
      logoPlacement: (preferencesSec.logoPlacement || "left").trim(),
      tone: (preferencesSec.toneDescriptors || ["Professional", "Innovative"])
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0)
    };

    // 11. Normalize SEO Configurations
    const metaKeywords = (seoSec.metaKeywords || [])
      .map((k: string) => k.trim())
      .filter((k: string) => k.length > 0);

    const seo: NormalizedPortfolioData["seo"] = {
      metaTitle: (seoSec.metaTitle || "").trim() || `${personal.fullName} | Portfolio`,
      metaDescription: (seoSec.metaDescription || "").trim() || `Professional work showcase of ${personal.fullName}.`,
      metaKeywords: metaKeywords.length > 0 ? metaKeywords : [personal.fullName, personal.profession]
    };

    return {
      personal,
      story,
      skills,
      projects,
      experience,
      education,
      services,
      testimonials,
      socials,
      preferences,
      seo
    };
  }
}
