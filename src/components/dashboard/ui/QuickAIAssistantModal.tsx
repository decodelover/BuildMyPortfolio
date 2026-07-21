"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  Wand2,
  FileText,
  Search,
  Palette,
  Check,
  Bot,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface QuickAIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export function QuickAIAssistantModal({ isOpen, onClose }: QuickAIAssistantModalProps) {
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Hello! I am your AI Copilot for BuildMyPortfolio. How can I assist you with your content, design, or SEO today?",
      timestamp: "Just now",
    },
  ]);

  const quickPrompts = [
    { label: "Refine Professional Bio", icon: FileText, prompt: "Rewrite my professional bio to be punchier and concise." },
    { label: "Optimize Portfolio SEO", icon: Search, prompt: "Suggest high-ranking keywords for a Full-Stack Software Developer." },
    { label: "Suggest Theme Color Palette", icon: Palette, prompt: "Recommend a high-contrast modern dark mode color palette." },
    { label: "Review Portfolio Quality", icon: Wand2, prompt: "Run an AI Quality Assurance scan on my portfolio." },
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isGenerating) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsGenerating(true);

    // Simulate Gemini AI Response
    setTimeout(() => {
      let aiResponseText = `Here is your AI optimization recommendation for: "${query}"\n\n`;
      if (query.toLowerCase().includes("bio")) {
        aiResponseText += `• **Headline**: "Architecting High-Performance Cloud Software & Intuitive Web Applications."\n• **Summary**: Senior Software Engineer specializing in distributed systems, Next.js 15, and real-time AI agents with 5+ years of enterprise SaaS experience.`;
      } else if (query.toLowerCase().includes("seo") || query.toLowerCase().includes("keywords")) {
        aiResponseText += `• **Title Tag**: "Senior Full-Stack Developer & AI Systems Engineer | Portfolio"\n• **Meta Description**: "Explore cloud architectures, microservices, and interactive web apps built by a Senior SaaS Architect."\n• **Top Keywords**: Next.js 15, TypeScript, React 19, Cloud Architecture, GraphQL, Tailwind CSS.`;
      } else if (query.toLowerCase().includes("color") || query.toLowerCase().includes("palette")) {
        aiResponseText += `• **Primary**: Cyan Glow (\`#06b6d4\`)\n• **Accent**: Deep Indigo (\`#4f46e5\`)\n• **Background**: Obsidian Charcoal (\`#090d16\`)\n• **Text**: Crisp Slate (\`#f8fafc\`)`;
      } else {
        aiResponseText += `I have analyzed your request. I recommend updating your portfolio layout in the Portfolio Builder Wizard to showcase your top 3 projects first, accompanied by live demo URLs and GitHub source badges.`;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end p-0 sm:p-6 pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm pointer-events-auto"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full sm:w-[440px] h-[600px] max-h-[90vh] rounded-t-3xl sm:rounded-3xl border border-border/80 bg-card/95 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden pointer-events-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-4 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center text-primary-foreground shadow-md">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    AI Copilot Workspace
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-accent/20 text-accent border border-accent/30">
                      Gemini
                    </span>
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-semibold">Instant portfolio assistant</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="px-4 py-3 border-b border-border/40 bg-muted/10 overflow-x-auto flex items-center gap-2 no-scrollbar">
              {quickPrompts.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(item.prompt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/60 bg-background/60 hover:bg-primary/10 hover:border-primary/30 text-[10px] font-semibold text-foreground whitespace-nowrap transition-all shrink-0 cursor-pointer"
                  >
                    <Icon className="h-3 w-3 text-primary" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Message History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-medium">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3",
                    msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div
                    className={cn(
                      "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border text-xs font-bold",
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-accent/20 text-accent border-accent/30"
                    )}
                  >
                    {msg.sender === "user" ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl p-3 shadow-xs space-y-1 text-left",
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-xs"
                        : "bg-muted/40 border border-border/50 text-foreground rounded-tl-xs whitespace-pre-line"
                    )}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <span className="block text-[9px] opacity-70 text-right">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {isGenerating && (
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-accent/20 text-accent border border-accent/30 flex items-center justify-center shrink-0">
                    <Sparkles className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="rounded-2xl rounded-tl-xs bg-muted/40 border border-border/50 px-4 py-3 text-xs text-muted-foreground font-semibold animate-pulse">
                    AI is thinking & analyzing context...
                  </div>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="border-t border-border/60 p-3 bg-card/90">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask AI Copilot anything..."
                  className="flex-1 rounded-xl border border-border/60 bg-background/80 px-3.5 py-2.5 text-xs font-medium placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/45"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isGenerating}
                  className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 transition-opacity cursor-pointer shadow-sm"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
