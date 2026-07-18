"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { skillsSchema, SkillsListData, SkillItemData } from "./formSchemas";
import { Plus, Trash2, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type SkillCategoryKey =
  | "frontend"
  | "backend"
  | "mobile"
  | "cloud"
  | "devops"
  | "databases"
  | "programmingLanguages"
  | "frameworks"
  | "libraries"
  | "testing"
  | "uiux"
  | "ai"
  | "machineLearning"
  | "cybersecurity"
  | "tools"
  | "softSkills";

interface CategoryDefinition {
  key: SkillCategoryKey;
  label: string;
  suggestions: string[];
}

const categoriesList: CategoryDefinition[] = [
  {
    key: "programmingLanguages",
    label: "Programming Languages",
    suggestions: ["JavaScript", "TypeScript", "Python", "Go", "Rust", "Java", "C++", "Ruby", "Swift", "PHP"],
  },
  {
    key: "frontend",
    label: "Frontend",
    suggestions: ["React", "HTML5", "CSS3", "Svelte", "Vue", "Angular", "Tailwind CSS", "Bootstrap", "WebGL"],
  },
  {
    key: "backend",
    label: "Backend",
    suggestions: ["Node.js", "Express", "NestJS", "FastAPI", "Django", "Spring Boot", "Rails", "GraphQL", "REST API"],
  },
  {
    key: "frameworks",
    label: "Frameworks",
    suggestions: ["Next.js", "Nuxt.js", "Gatsby", "Laravel", "Flask", "SvelteKit"],
  },
  {
    key: "libraries",
    label: "Libraries",
    suggestions: ["Redux", "Zustand", "RxJS", "Lodash", "Framer Motion", "D3.js", "Prisma", "Mongoose"],
  },
  {
    key: "databases",
    label: "Databases",
    suggestions: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "SQLite", "DynamoDB", "Cassandra", "Firebase Firestore"],
  },
  {
    key: "cloud",
    label: "Cloud Services",
    suggestions: ["AWS", "Google Cloud (GCP)", "Azure", "Vercel", "Netlify", "Heroku", "Firebase Auth/Hosting"],
  },
  {
    key: "devops",
    label: "DevOps & CI/CD",
    suggestions: ["Docker", "Kubernetes", "GitHub Actions", "GitLab CI", "Terraform", "Ansible", "Nginx", "Linux"],
  },
  {
    key: "mobile",
    label: "Mobile Development",
    suggestions: ["React Native", "Flutter", "SwiftUI", "Kotlin", "Ionic", "Xamarin"],
  },
  {
    key: "testing",
    label: "Testing & QA",
    suggestions: ["Jest", "Cypress", "Playwright", "Mocha", "React Testing Library", "Selenium"],
  },
  {
    key: "uiux",
    label: "UI/UX Design",
    suggestions: ["Figma", "Adobe XD", "Wireframing", "Prototyping", "User Research", "Design Systems"],
  },
  {
    key: "ai",
    label: "Artificial Intelligence",
    suggestions: ["Gemini API", "OpenAI API", "LangChain", "Vector Databases", "Prompt Engineering", "LLMs"],
  },
  {
    key: "machineLearning",
    label: "Machine Learning",
    suggestions: ["TensorFlow", "PyTorch", "Scikit-Learn", "Pandas", "NumPy", "Keras", "Data Pipelines"],
  },
  {
    key: "cybersecurity",
    label: "Cybersecurity",
    suggestions: ["OAuth 2.0", "JWT", "Penetration Testing", "Encryption", "Security Audits", "OWASP Top 10"],
  },
  {
    key: "tools",
    label: "Tools & Utilities",
    suggestions: ["Git", "VS Code", "Postman", "Webpack", "Vite", "ESLint", "Npm / Yarn / Pnpm"],
  },
  {
    key: "softSkills",
    label: "Soft Skills",
    suggestions: ["Team Leadership", "Agile / Scrum", "Technical Writing", "Public Speaking", "Problem Solving", "Mentoring"],
  },
];

export function SkillsForm() {
  const updateWebsiteData = useWebsiteBuilderStore((state) => state.updateWebsiteData);
  const setValidationState = useWebsiteBuilderStore((state) => state.setValidationState);
  const stepKey = "skills";
  const defaultValues = useWebsiteBuilderStore.getState().websiteData[stepKey] || {};

  const [activeCategory, setActiveCategory] = useState<SkillCategoryKey>("programmingLanguages");
  const [customSkill, setCustomSkill] = useState("");

  const {
    register,
    control,
    watch,
    getValues,
    setValue,
    formState: { isValid },
  } = useForm<SkillsListData>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      frontend: defaultValues.frontend || [],
      backend: defaultValues.backend || [],
      mobile: defaultValues.mobile || [],
      cloud: defaultValues.cloud || [],
      devops: defaultValues.devops || [],
      databases: defaultValues.databases || [],
      programmingLanguages: defaultValues.programmingLanguages || [],
      frameworks: defaultValues.frameworks || [],
      libraries: defaultValues.libraries || [],
      testing: defaultValues.testing || [],
      uiux: defaultValues.uiux || [],
      ai: defaultValues.ai || [],
      machineLearning: defaultValues.machineLearning || [],
      cybersecurity: defaultValues.cybersecurity || [],
      tools: defaultValues.tools || [],
      softSkills: defaultValues.softSkills || [],
    },
    mode: "onChange",
  });

  const arrays: Record<SkillCategoryKey, any> = {
    programmingLanguages: useFieldArray({ control, name: "programmingLanguages" }),
    frontend: useFieldArray({ control, name: "frontend" }),
    backend: useFieldArray({ control, name: "backend" }),
    frameworks: useFieldArray({ control, name: "frameworks" }),
    libraries: useFieldArray({ control, name: "libraries" }),
    databases: useFieldArray({ control, name: "databases" }),
    cloud: useFieldArray({ control, name: "cloud" }),
    devops: useFieldArray({ control, name: "devops" }),
    mobile: useFieldArray({ control, name: "mobile" }),
    testing: useFieldArray({ control, name: "testing" }),
    uiux: useFieldArray({ control, name: "uiux" }),
    ai: useFieldArray({ control, name: "ai" }),
    machineLearning: useFieldArray({ control, name: "machineLearning" }),
    cybersecurity: useFieldArray({ control, name: "cybersecurity" }),
    tools: useFieldArray({ control, name: "tools" }),
    softSkills: useFieldArray({ control, name: "softSkills" }),
  };

  const watchedValues = watch();

  // Keep validation state in sync in real-time
  useEffect(() => {
    setValidationState(8, isValid);
  }, [isValid, setValidationState]);

  // Keep form data in sync with store
  useEffect(() => {
    const subscription = watch((value) => {
      updateWebsiteData(stepKey, value);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateWebsiteData]);

  const activeCategoryDef = categoriesList.find((c) => c.key === activeCategory) || categoriesList[0];
  const activeFields = arrays[activeCategory].fields;
  const { append, remove } = arrays[activeCategory];

  const handleAddSkill = (name: string) => {
    if (!name.trim()) return;

    // Prevent duplicate entries within the active category
    const currentList = getValues(activeCategory) as SkillItemData[];
    const alreadyExists = currentList.some((s) => s.name.toLowerCase() === name.trim().toLowerCase());

    if (alreadyExists) {
      toast.info(`"${name}" is already in your ${activeCategoryDef.label} list.`);
      return;
    }

    append({
      name: name.trim(),
      yearsExperience: "",
      level: "Intermediate",
      isFeatured: false,
    });
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill.trim()) {
      handleAddSkill(customSkill);
      setCustomSkill("");
    }
  };

  return (
    <div className="space-y-6 text-left text-xs font-semibold">
      {/* Category Select Sidebar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible border-b md:border-b-0 md:border-r border-border pb-3 md:pb-0 md:pr-4 gap-1.5 scrollbar-none">
          {categoriesList.map((cat) => {
            const count = watchedValues[cat.key]?.length || 0;
            const isActive = activeCategory === cat.key;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  "w-full flex items-center justify-between gap-3.5 rounded-xl px-3.5 py-2.5 text-left transition-all cursor-pointer font-bold shrink-0 border md:border-0",
                  isActive
                    ? "bg-primary/10 border-primary/20 text-primary"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground border-transparent"
                )}
              >
                <span className="truncate">{cat.label}</span>
                {count > 0 && (
                  <span className={cn(
                    "rounded-full px-1.5 py-0.5 text-[9px] font-mono",
                    isActive ? "bg-primary text-primary-foreground" : "bg-muted-foreground/15 text-muted-foreground"
                  )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div className="md:col-span-3 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-bold text-foreground">{activeCategoryDef.label}</h3>
              <p className="text-[10px] text-muted-foreground font-medium">Add skills and indicate your level and experience details.</p>
            </div>
            {/* Custom Skill Input Form */}
            <form onSubmit={handleAddCustom} className="flex gap-2">
              <input
                type="text"
                placeholder="Custom skill name..."
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45 w-40"
              />
              <button
                type="submit"
                className="flex items-center justify-center p-1.5 bg-secondary text-secondary-foreground rounded-lg border border-border hover:bg-secondary/80 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Suggested Skills Grid */}
          <div className="space-y-2.5">
            <h4 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" /> Click to add suggested skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {activeCategoryDef.suggestions.map((sug) => {
                const isAdded = (watchedValues[activeCategory] as SkillItemData[]).some(
                  (s) => s.name.toLowerCase() === sug.toLowerCase()
                );

                return (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => handleAddSkill(sug)}
                    className={cn(
                      "rounded-full px-3 py-1 text-[10px] font-bold border transition-all cursor-pointer",
                      isAdded
                        ? "bg-accent/15 border-accent text-accent"
                        : "bg-background border-border text-muted-foreground hover:bg-muted hover:border-primary/45"
                    )}
                  >
                    {sug} {isAdded && "✓"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Skills List Editor */}
          {activeFields.length === 0 ? (
            <p className="text-muted-foreground text-[10px] text-center py-8 font-medium">
              No skills added under this category. Select suggested badges above or add custom ones.
            </p>
          ) : (
            <div className="space-y-3.5">
              {activeFields.map((field: any, index: number) => (
                <div
                  key={field.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 border border-border rounded-xl bg-card hover:border-primary/20 transition-all shadow-sm"
                >
                  {/* Skill name badge */}
                  <span className="text-xs font-bold text-foreground bg-secondary border border-border rounded-lg px-2.5 py-1.5 min-w-[120px] truncate">
                    {field.name}
                  </span>

                  {/* Experience */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="Yrs Exp (e.g. 5)"
                      {...register(`${activeCategory}.${index}.yearsExperience` as const)}
                      className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45 w-24"
                    />
                  </div>

                  {/* Level select */}
                  <select
                    {...register(`${activeCategory}.${index}.level` as const)}
                    className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45 w-28 cursor-pointer"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>

                  {/* Featured Checkbox */}
                  <div className="flex items-center gap-1.5 text-[11px] text-foreground">
                    <input
                      type="checkbox"
                      id={`skills.${activeCategory}.${index}.isFeatured`}
                      {...register(`${activeCategory}.${index}.isFeatured` as const)}
                      className="rounded border-border text-primary focus:ring-1 focus:ring-primary/45 cursor-pointer h-3.5 w-3.5"
                    />
                    <label htmlFor={`skills.${activeCategory}.${index}.isFeatured`} className="cursor-pointer font-bold select-none">
                      Featured
                    </label>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="sm:ml-auto p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                    aria-label="Remove skill"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default SkillsForm;
