import { StructuredDataSchemas, SEOContext } from "../types";
import { SeoSanitizer } from "../security/seo-sanitizer";

export class StructuredDataEngine {
  
  public static resolve(context: SEOContext): StructuredDataSchemas {
    const personal = context.normalizedData.personal;
    const story = context.normalizedData.story;
    const services = context.normalizedData.services || [];
    const projects = context.normalizedData.projects || [];
    
    const domain = context.seoPreference.canonicalUrl || "https://buildmyportfolio.ai";
    const slug = context.seoPreference.customSlug || 
      personal.fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const portfolioUrl = `${domain}/${slug}`;

    // 1. Person Schema
    const person = SeoSanitizer.preventJsonLdInjection({
      "@context": "https://schema.org",
      "@type": "Person",
      "name": personal.fullName,
      "jobTitle": personal.profession,
      "description": personal.bioSummary,
      "email": personal.email,
      "telephone": personal.phone,
      "url": portfolioUrl,
      "image": personal.avatarUrl || `${domain}/images/avatar-default.png`,
      "sameAs": Object.values(context.normalizedData.socials || {}).filter(Boolean)
    });

    // 2. WebSite Schema
    const webSite = SeoSanitizer.preventJsonLdInjection({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": `${personal.fullName} Developer Portfolio`,
      "url": portfolioUrl,
      "author": {
        "@type": "Person",
        "name": personal.fullName
      }
    });

    // 3. Organization Schema (using school or custom corporate placeholder)
    const organization = SeoSanitizer.preventJsonLdInjection({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": `${personal.fullName} Consulting`,
      "url": portfolioUrl,
      "logo": personal.avatarUrl || `${domain}/images/logo-default.png`
    });

    // 4. BreadcrumbList Schema
    const breadcrumbList = SeoSanitizer.preventJsonLdInjection({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": domain
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": personal.fullName,
          "item": portfolioUrl
        }
      ]
    });

    // 5. ProfilePage Schema
    const profilePage = SeoSanitizer.preventJsonLdInjection({
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "mainEntity": person
    });

    // 6. Occupation Schema
    const occupation = SeoSanitizer.preventJsonLdInjection({
      "@context": "https://schema.org",
      "@type": "Occupation",
      "name": personal.profession,
      "estimatedSalary": [],
      "educationRequirements": []
    });

    // 7. Services Schemas
    const resolvedServices = services.map((s) => 
      SeoSanitizer.preventJsonLdInjection({
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": s.title,
        "description": s.description,
        "provider": {
          "@type": "Person",
          "name": personal.fullName
        }
      })
    );

    // 8. Project Schemas
    const resolvedProjects = projects.map((p) => 
      SeoSanitizer.preventJsonLdInjection({
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": p.title,
        "description": p.description,
        "creator": {
          "@type": "Person",
          "name": personal.fullName
        },
        "url": p.liveUrl || p.githubUrl || portfolioUrl
      })
    );

    // 9. Article/Blog teaser Schemas
    const resolvedArticles = [
      SeoSanitizer.preventJsonLdInjection({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": `${personal.fullName}'s Professional Journey`,
        "description": story.backgroundSummary || "Read about my professional experience and background milestones.",
        "author": {
          "@type": "Person",
          "name": personal.fullName
        },
        "publisher": {
          "@type": "Organization",
          "name": "BuildMyPortfolio"
        },
        "datePublished": new Date().toISOString()
      })
    ];

    // 10. FAQ Schema
    const faqPage = SeoSanitizer.preventJsonLdInjection({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `What is ${personal.fullName}'s specialization?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `I specialize in ${personal.profession} and engineering solutions.`
          }
        },
        {
          "@type": "Question",
          "name": "How can I get in touch for projects?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `You can contact me directly at my email: ${personal.email}.`
          }
        }
      ]
    });

    return {
      person,
      profilePage,
      webSite,
      organization,
      breadcrumbList,
      occupation,
      service: resolvedServices,
      project: resolvedProjects,
      article: resolvedArticles,
      faqPage
    };
  }
}
