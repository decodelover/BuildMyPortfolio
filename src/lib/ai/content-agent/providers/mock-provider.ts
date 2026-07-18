import { IAIContentProvider, ContentGenerationPrompt, ContentGenerationResponse, ContentGenerationConfig } from "../provider-interface";

export class MockContentProvider implements IAIContentProvider {
  public readonly id = "mock-provider";
  public readonly name = "Local Mock Generation Engine";

  public async generateContent(
    prompt: ContentGenerationPrompt,
    config?: ContentGenerationConfig
  ): Promise<ContentGenerationResponse> {
    const { taskType, variables } = prompt;
    const personal = variables.personal || {};
    const story = variables.story || {};
    const skills = variables.skills || [];
    const projects = variables.projects || [];
    const experience = variables.experience || [];
    const services = variables.services || [];
    const testimonials = variables.testimonials || [];
    const socials = variables.socials || {};
    const preferences = variables.preferences || {};
    const seo = variables.seo || {};

    const name = personal.fullName || "John Doe";
    const title = personal.profession || "Senior Full-Stack Engineer";

    let textOutput = "";
    let jsonOutput: Record<string, any> = {};

    // Artificially simulate processing latency (e.g., 50ms to 100ms)
    await new Promise((resolve) => setTimeout(resolve, 80));

    switch (taskType) {
      case "hero":
        jsonOutput = {
          headline: personal.headline || `Building modern digital solutions as a ${title}`,
          subheadline: personal.bioSummary || `Hello! I'm ${name}. I design and engineer scalable web architectures, optimize distributed systems, and craft responsive interactive user experiences.`,
          ctaText: "Explore Portfolio",
          secondaryCtaText: "Get in Touch"
        };
        textOutput = JSON.stringify(jsonOutput, null, 2);
        break;

      case "about":
        jsonOutput = {
          title: "About Me",
          paragraphs: [
            story.backgroundSummary || `I am a driven ${title} with ${story.yearsOfExperience || 5}+ years of hands-on experience in building performant enterprise software.`,
            `My core competencies focus on clean code design patterns, security auditing, database optimization, and implementing scalable cloud architectures. I thrive on solving complex engineering challenges and mentoring peers.`
          ],
          values: story.coreValues && story.coreValues.length > 0 ? story.coreValues : ["Clean Code Architecture", "Security Auditing", "Client-Focused Results"]
        };
        textOutput = JSON.stringify(jsonOutput, null, 2);
        break;

      case "career-objective":
        jsonOutput = {
          objective: `To leverage my expertise in full-stack architecture, clean coding practices, and distributed systems to build high-performance software at an innovative technology organization.`
        };
        textOutput = JSON.stringify(jsonOutput, null, 2);
        break;

      case "project-descriptions":
        jsonOutput = {
          items: projects.map((p: any, idx: number) => ({
            id: p.id || `p-${idx}`,
            title: p.title || `Featured Product Dashboard`,
            overview: p.description || `Built a highly scalable, real-time analytics panel featuring integrated dashboards and responsive chart components.`,
            role: p.role || "Lead Architect",
            technologies: p.technologies || ["TypeScript", "Next.js", "Tailwind CSS"],
            achievement: "Improved data loading performance by 45% using optimized memoized caching policies.",
            liveUrl: p.liveUrl || "",
            githubUrl: p.githubUrl || ""
          }))
        };
        textOutput = JSON.stringify(jsonOutput, null, 2);
        break;

      case "experience-descriptions":
        jsonOutput = {
          items: experience.map((exp: any, idx: number) => ({
            id: exp.id || `exp-${idx}`,
            company: exp.company || "Innovate Tech",
            role: exp.role || "Senior React Engineer",
            responsibilities: [
              `Architected core component libraries using highly optimized custom hooks and Tailwind utility tokens.`,
              `Mentored junior engineering teams to maintain clean, reusable, and secure React patterns.`,
              `Restructured distributed backend queries which successfully reduced execution latency by 30%.`
            ],
            duration: `${exp.startDate || "2023"} - ${exp.current ? "Present" : (exp.endDate || "2025")}`
          }))
        };
        textOutput = JSON.stringify(jsonOutput, null, 2);
        break;

      case "achievement-highlights":
        jsonOutput = {
          highlights: story.careerMilestones && story.careerMilestones.length > 0 ? story.careerMilestones : [
            "Successfully deployed over 15 production web architectures with zero critical post-release patches.",
            "Optimized continuous integration/delivery workflows, reducing team build deploy cycles by 25%.",
            "Received Developer of the Year recognition at previous company."
          ]
        };
        textOutput = JSON.stringify(jsonOutput, null, 2);
        break;

      case "skills-summary":
        jsonOutput = {
          intro: `Possessing a comprehensive skill set spanning client interface development, database design, server configurations, and system orchestration.`,
          categories: Array.from(new Set(skills.map((s: any) => s.category || "General"))).map((cat) => ({
            name: cat,
            skills: skills.filter((s: any) => (s.category || "General") === cat).map((s: any) => s.name)
          }))
        };
        textOutput = JSON.stringify(jsonOutput, null, 2);
        break;

      case "service-descriptions":
        jsonOutput = {
          items: services.map((s: any, idx: number) => ({
            id: s.id || `srv-${idx}`,
            title: s.title || "Custom Web Development",
            description: s.description || "End-to-end full-stack web applications structured around modern standard libraries.",
            features: s.features || ["Responsive layout grids", "State-management hydration", "Firebase integration"],
            price: s.price || "Contact for Custom Quote"
          }))
        };
        textOutput = JSON.stringify(jsonOutput, null, 2);
        break;

      case "cta":
        jsonOutput = {
          title: "Have a Project in Mind?",
          description: "Let's collaborate on transforming your ideas into a high-performance production-ready platform.",
          buttonText: "Schedule Consultation"
        };
        textOutput = JSON.stringify(jsonOutput, null, 2);
        break;

      case "headlines":
        jsonOutput = {
          headline: `Hello, I'm ${name}. I translate complex problems into elegant, production-ready code.`,
          subtext: `Full-Stack Architect specialized in creating modular design systems and optimized server-side logic.`
        };
        textOutput = JSON.stringify(jsonOutput, null, 2);
        break;

      case "section-intros":
        jsonOutput = {
          about: "A look into my professional background, core technical standards, and engineering values.",
          projects: "A curated collection of production client applications, SaaS projects, and open-source contributions.",
          services: "High-quality software consulting services engineered to launch your product efficiently.",
          faq: "Answers to common questions regarding technical capability, timeline estimates, and project scope."
        };
        textOutput = JSON.stringify(jsonOutput, null, 2);
        break;

      case "testimonials-formatting":
        jsonOutput = {
          testimonials: testimonials.map((t: any, idx: number) => ({
            id: t.id || `t-${idx}`,
            feedback: t.feedback || `An outstanding collaborator. Delivered robust design interfaces well ahead of schedule.`,
            author: t.clientName || "Jane Smith",
            role: `${t.clientRole || "Product Owner"}, ${t.clientCompany || "Enterprise Inc"}`
          }))
        };
        textOutput = JSON.stringify(jsonOutput, null, 2);
        break;

      case "faq":
        jsonOutput = {
          faqs: [
            { question: "What is your main technology stack?", answer: "My core expertise centers around TypeScript, React, Next.js, Node.js, and GCP/Firebase." },
            { question: "Do you offer post-launch application maintenance?", answer: "Yes, I provide comprehensive system monitoring, SLA security patches, and incremental feature updates." },
            { question: "How do you handle project scoping and execution?", answer: "I apply strict software validation principles, breaking requirements down into modular tasks for clear progress transparency." }
          ]
        };
        textOutput = JSON.stringify(jsonOutput, null, 2);
        break;

      case "contact-copy":
        jsonOutput = {
          title: "Let's Connect",
          description: "Feel free to reach out via email or any of my social profiles. I will get back to you within 24 hours.",
          emailText: personal.email || "hello@tarispace.me",
          phoneText: personal.phone || "",
          formPlaceholderName: "Your Full Name",
          formPlaceholderEmail: "you@example.com",
          formPlaceholderMessage: "Tell me about your project details..."
        };
        textOutput = JSON.stringify(jsonOutput, null, 2);
        break;

      case "footer-copy":
        jsonOutput = {
          copyright: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
          subtext: "Designed & Compiled using BuildMyPortfolio"
        };
        textOutput = JSON.stringify(jsonOutput, null, 2);
        break;

      case "blog-intro":
        jsonOutput = {
          headline: "Engineering Articles & Insights",
          description: "Sharing deep-dives on React rendering optimizations, system security protocols, and server infrastructure blueprints."
        };
        textOutput = JSON.stringify(jsonOutput, null, 2);
        break;

      case "portfolio-tagline":
        jsonOutput = {
          tagline: `Elegant code. Extensible design. Exceptional products.`
        };
        textOutput = JSON.stringify(jsonOutput, null, 2);
        break;

      case "professional-bio":
        jsonOutput = {
          bio: `Hello! I'm ${name}, a passionate ${title} devoted to developing enterprise applications. Over the course of my career, I've worked across multiple industries, helping startups scale and corporations modernize code patterns.`
        };
        textOutput = JSON.stringify(jsonOutput, null, 2);
        break;

      default:
        jsonOutput = { data: `Local stub data for task type: ${taskType}` };
        textOutput = `Local stub content for task type: ${taskType}`;
    }

    return {
      text: textOutput,
      jsonData: jsonOutput,
      metadata: {
        name: this.name,
        model: "mock-runner-v1",
        version: "1.0.0"
      },
      usage: {
        promptTokens: 150,
        completionTokens: 250,
        totalTokens: 400
      }
    };
  }
}
