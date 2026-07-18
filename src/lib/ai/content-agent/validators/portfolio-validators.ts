import { ValidationIssue, ValidationSeverity } from "../types";

// RFC 5322 Email Validation Pattern
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\+?[0-9\s\-()]{7,20}$/;

export function validateEmail(email?: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!email) {
    issues.push({
      field: "personalInfo.email",
      message: "Email address is missing.",
      severity: "error"
    });
    return issues;
  }
  if (!EMAIL_REGEX.test(email)) {
    issues.push({
      field: "personalInfo.email",
      message: "Email address format is invalid.",
      severity: "error"
    });
  }
  return issues;
}

export function validatePhone(phone?: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (phone && !PHONE_REGEX.test(phone)) {
    issues.push({
      field: "personalInfo.phone",
      message: "Phone number format appears invalid.",
      severity: "warning"
    });
  }
  return issues;
}

export function validateURL(field: string, url?: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!url) return issues;
  
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      issues.push({
        field,
        message: `URL protocol must be HTTP or HTTPS. Found: '${parsed.protocol}'`,
        severity: "error"
      });
    }
  } catch (err) {
    issues.push({
      field,
      message: `Invalid URL format: '${url}'`,
      severity: "error"
    });
  }
  return issues;
}

export function validatePersonalInfo(info: Record<string, any> = {}): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!info.fullName || info.fullName.trim() === "") {
    issues.push({
      field: "personalInfo.fullName",
      message: "Full Name is required.",
      severity: "error"
    });
  }
  if (!info.profession || info.profession.trim() === "") {
    issues.push({
      field: "personalInfo.profession",
      message: "Profession / Job Title is required.",
      severity: "error"
    });
  }
  issues.push(...validateEmail(info.email));
  issues.push(...validatePhone(info.phone));
  return issues;
}

export function validateSkills(skillsSection: Record<string, any> = {}): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const list = skillsSection.skills || [];
  if (list.length === 0) {
    issues.push({
      field: "skills",
      message: "At least one skill should be added for a complete portfolio.",
      severity: "warning"
    });
  }
  list.forEach((s: any, idx: number) => {
    if (!s.name || s.name.trim() === "") {
      issues.push({
        field: `skills.skills[${idx}].name`,
        message: "Skill name is missing.",
        severity: "error"
      });
    }
  });
  return issues;
}

export function validateProjects(projectsSection: Record<string, any> = {}): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const list = projectsSection.projects || [];
  if (list.length === 0) {
    issues.push({
      field: "projects",
      message: "Adding featured projects makes a portfolio much more compelling.",
      severity: "warning"
    });
  }
  list.forEach((p: any, idx: number) => {
    if (!p.title || p.title.trim() === "") {
      issues.push({
        field: `projects.projects[${idx}].title`,
        message: "Project title is missing.",
        severity: "error"
      });
    }
    if (p.liveUrl) {
      issues.push(...validateURL(`projects.projects[${idx}].liveUrl`, p.liveUrl));
    }
    if (p.githubUrl) {
      issues.push(...validateURL(`projects.projects[${idx}].githubUrl`, p.githubUrl));
    }
  });
  return issues;
}

export function validateExperience(experienceSection: Record<string, any> = {}): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const list = experienceSection.experience || [];
  list.forEach((exp: any, idx: number) => {
    if (!exp.company || exp.company.trim() === "") {
      issues.push({
        field: `experience.experience[${idx}].company`,
        message: "Experience company name is missing.",
        severity: "error"
      });
    }
    if (!exp.role || exp.role.trim() === "") {
      issues.push({
        field: `experience.experience[${idx}].role`,
        message: "Experience job role is missing.",
        severity: "error"
      });
    }
  });
  return issues;
}

export function validateEducation(educationSection: Record<string, any> = {}): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const list = educationSection.education || [];
  list.forEach((edu: any, idx: number) => {
    if (!edu.institution || edu.institution.trim() === "") {
      issues.push({
        field: `education.education[${idx}].institution`,
        message: "Education institution is missing.",
        severity: "error"
      });
    }
    if (!edu.degree || edu.degree.trim() === "") {
      issues.push({
        field: `education.education[${idx}].degree`,
        message: "Education degree / certification is missing.",
        severity: "error"
      });
    }
  });
  return issues;
}

export function validateSocialLinks(socialsSection: Record<string, any> = {}): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const socials = socialsSection.socials || {};
  Object.keys(socials).forEach((platform) => {
    const url = socials[platform];
    if (url) {
      issues.push(...validateURL(`socialLinks.socials.${platform}`, url));
      // Heuristic platform validations
      if (platform === "linkedin" && !url.includes("linkedin.com")) {
        issues.push({
          field: `socialLinks.socials.linkedin`,
          message: "LinkedIn profile URL should contain 'linkedin.com'.",
          severity: "warning"
        });
      }
      if (platform === "github" && !url.includes("github.com")) {
        issues.push({
          field: `socialLinks.socials.github`,
          message: "GitHub profile URL should contain 'github.com'.",
          severity: "warning"
        });
      }
    }
  });
  return issues;
}
