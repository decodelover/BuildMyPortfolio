import { DesignThemeId, ProfessionCategory } from "../types";

export class DesignAgentConfig {
  public static readonly defaultTimeoutMs = 15000;
  
  public static readonly supportedThemes: DesignThemeId[] = [
    "modern",
    "minimal",
    "executive",
    "corporate",
    "creative",
    "startup",
    "dark-developer",
    "glassmorphism"
  ];

  public static readonly professionMap: Record<string, ProfessionCategory> = {
    "full-stack": "full-stack-developer",
    "fullstack": "full-stack-developer",
    "frontend": "frontend-developer",
    "front-end": "frontend-developer",
    "backend": "backend-developer",
    "back-end": "backend-developer",
    "mobile": "mobile-developer",
    "android": "mobile-developer",
    "ios": "mobile-developer",
    "ai": "ai-ml-engineer",
    "machine learning": "ai-ml-engineer",
    "ml": "ai-ml-engineer",
    "data scientist": "data-scientist",
    "data science": "data-scientist",
    "devops": "devops-cloud-engineer",
    "cloud": "devops-cloud-engineer",
    "cybersecurity": "cybersecurity-engineer",
    "security": "cybersecurity-engineer",
    "blockchain": "blockchain-developer",
    "web3": "blockchain-developer",
    "game": "game-developer",
    "unity": "game-developer",
    "unreal": "game-developer",
    "ui": "ui-ux-designer",
    "ux": "ui-ux-designer",
    "designer": "product-designer",
    "product designer": "product-designer",
    "software engineer": "software-engineer",
    "developer": "software-engineer",
    "consultant": "general-consultant",
    "advisor": "general-consultant",
    "marketing": "marketing-creative",
    "copywriter": "marketing-creative",
    "writer": "marketing-creative"
  };

  public static getProfessionCategory(profession: string): ProfessionCategory {
    const norm = profession.toLowerCase().trim();
    for (const key of Object.keys(this.professionMap)) {
      if (norm.includes(key)) {
        return this.professionMap[key];
      }
    }
    return "general-professional";
  }
}
