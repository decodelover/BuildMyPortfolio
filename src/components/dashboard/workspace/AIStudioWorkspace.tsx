"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Bot,
  FileText,
  Search,
  Briefcase,
  Code,
  Send,
  Zap,
  CheckCircle2,
  Copy,
  Terminal,
  Bookmark,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function AIStudioWorkspace() {
  const [activeAssistant, setActiveAssistant] = useState(0);
  const [userPrompt, setUserPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const assistants = [
    {
      id: "portfolio-coach",
      name: "Portfolio Coach",
      icon: Bot,
      badge: "Recruiter Impact",
      desc: "Analyzes layout structure, project impact statements, and recruiter conversion metrics.",
      placeholder: "Ask how to improve recruiter engagement on your portfolio...",
    },
    {
      id: "ai-copywriter",
      name: "AI Copywriter",
      icon: FileText,
      badge: "Copywriting",
      desc: "Auto-formulates punchy developer bios, career achievement summaries, and project descriptions.",
      placeholder: "Describe a project you built to generate a professional summary...",
    },
    {
      id: "seo-assistant",
      name: "Technical SEO Advisor",
      icon: Search,
      badge: "Lighthouse 100",
      desc: "Generates JSON-LD structured schemas, meta titles, OpenGraph social cards, and sitemaps.",
      placeholder: "Enter target job titles or keywords for SEO optimization...",
    },
    {
      id: "career-advisor",
      name: "Career & Resume Coach",
      icon: Briefcase,
      badge: "Career Growth",
      desc: "Tailors resume bullets, interview prep strategies, and skill presentation for top tech companies.",
      placeholder: "Ask for interview preparation tips or resume bullet points...",
    },
    {
      id: "code-assistant",
      name: "Code Snippet Generator",
      icon: Code,
      badge: "Next.js & Tailwind",
      desc: "Generates custom React components, Tailwind styling tokens, and Framer Motion animation code.",
      placeholder: "Request a custom React component or CSS styling snippet...",
    },
  ];

  const sampleHistory = [
    {
      id: "h1",
      role: "user",
      text: "Write a high-impact bio for a Senior Full-Stack Engineer with 5+ years of React and Cloud experience.",
    },
    {
      id: "h2",
      role: "assistant",
      text: "Senior Full-Stack Architect with 5+ years of experience engineering high-throughput Next.js 15 microservices, TypeScript applications, and distributed cloud engines. Proven track record reducing LCP page speeds below 0.8s and maintaining 99.9% edge CDN SLA uptime across global user bases.",
    },
  ];

  const handleSendPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPrompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("AI response generated!");
      setUserPrompt("");
    }, 1200);
  };

  return (
    <div className="space-y-6 text-left select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" /> AI Studio &amp; Copilot Workspace
          </h1>
          <p className="text-xs text-muted-foreground font-medium">
            Collaborate with 5 specialized Gemini AI agents to write copy, optimize SEO, and refine portfolio structure.
          </p>
        </div>

        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-extrabold flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" /> Gemini Pro v2.0 Active
        </div>
      </div>

      {/* Assistant Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-border/40 pb-2">
        {assistants.map((ast, idx) => {
          const Icon = ast.icon;
          return (
            <button
              key={ast.id}
              type="button"
              onClick={() => setActiveAssistant(idx)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border",
                activeAssistant === idx
                  ? "bg-primary text-primary-foreground border-primary shadow-xs scale-105"
                  : "bg-card border-border/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{ast.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Studio Workspace Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Chat & Response Console */}
        <div className="lg:col-span-2 rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-6 flex flex-col justify-between min-h-[480px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-foreground">{assistants[activeAssistant].name}</h3>
                  <p className="text-[10px] text-muted-foreground">{assistants[activeAssistant].desc}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-accent/10 text-accent border border-accent/20">
                {assistants[activeAssistant].badge}
              </span>
            </div>

            {/* Conversation Messages */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 text-xs">
              {sampleHistory.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "p-4 rounded-2xl max-w-xl font-medium leading-relaxed",
                    m.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground rounded-br-xs"
                      : "bg-background/80 border border-border/60 text-foreground rounded-bl-xs space-y-2"
                  )}
                >
                  <p>{m.text}</p>
                  {m.role === "assistant" && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(m.text);
                          toast.success("Copied to clipboard!");
                        }}
                        className="px-2 py-1 rounded-md bg-muted text-[10px] font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="h-3 w-3" /> Copy Output
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {isGenerating && (
                <div className="p-4 rounded-2xl bg-background/80 border border-border/60 text-xs font-mono text-primary flex items-center gap-2 animate-pulse">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Gemini AI is formulating response...
                </div>
              )}
            </div>
          </div>

          {/* Prompt Input Form */}
          <form onSubmit={handleSendPrompt} className="pt-4 border-t border-border/40 space-y-2">
            <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/80 p-2 shadow-inner">
              <input
                type="text"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder={assistants[activeAssistant].placeholder}
                className="w-full bg-transparent px-2 text-xs font-medium text-foreground focus:outline-none"
              />
              <button
                type="submit"
                disabled={isGenerating || !userPrompt.trim()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
              >
                Send Prompt <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Quick Prompts & AI Memory */}
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-4 text-left">
          <h4 className="text-xs font-extrabold text-foreground flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-primary" /> Recommended Prompt Templates
          </h4>

          <div className="space-y-2">
            {[
              "Generate a 3-sentence recruiter bio",
              "Suggest Lighthouse 100 SEO meta tags",
              "Format bullet points for senior React engineer",
              "Formulate project summary for cloud microservices",
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setUserPrompt(p)}
                className="w-full text-left p-3 rounded-2xl border border-border/50 bg-background/60 hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                "{p}"
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-border/40 space-y-2 text-[11px] text-muted-foreground">
            <div className="flex items-center justify-between font-bold text-foreground">
              <span>Monthly Credits Used:</span>
              <span className="text-primary font-mono font-extrabold">2,450 / 2,500</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-[98%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
