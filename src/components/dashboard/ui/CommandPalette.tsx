"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  PlusCircle,
  FolderKanban,
  CreditCard,
  User,
  Settings,
  Sun,
  Moon,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Command,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAIAssistant?: () => void;
}

export function CommandPalette({ isOpen, onClose, onOpenAIAssistant }: CommandPaletteProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Command items definition
  const commands = [
    {
      id: "create-portfolio",
      title: "Create New Portfolio",
      subtitle: "Launch AI Portfolio Builder Wizard",
      icon: PlusCircle,
      badge: "AI Powered",
      action: () => {
        router.push("/dashboard/create");
        onClose();
      },
    },
    {
      id: "ai-assistant",
      title: "Open AI Assistant",
      subtitle: "Get smart suggestions & content optimization",
      icon: Sparkles,
      badge: "Copilot",
      action: () => {
        onClose();
        if (onOpenAIAssistant) onOpenAIAssistant();
      },
    },
    {
      id: "view-portfolios",
      title: "My Portfolios",
      subtitle: "Manage, preview, and edit published portfolios",
      icon: FolderKanban,
      action: () => {
        router.push("/dashboard/portfolios");
        onClose();
      },
    },
    {
      id: "billing",
      title: "Billing & Subscriptions",
      subtitle: "View usage limits, plan upgrades, and invoices",
      icon: CreditCard,
      action: () => {
        router.push("/dashboard/billing");
        onClose();
      },
    },
    {
      id: "profile",
      title: "User Profile & Security",
      subtitle: "Update account info, passwords, and security",
      icon: User,
      action: () => {
        router.push("/dashboard/profile");
        onClose();
      },
    },
    {
      id: "settings",
      title: "Workspace Settings",
      subtitle: "Configure notifications, appearance, and integrations",
      icon: Settings,
      action: () => {
        router.push("/dashboard/settings");
        onClose();
      },
    },
    {
      id: "toggle-theme",
      title: `Switch Theme (${theme === "dark" ? "Light" : "Dark"} Mode)`,
      subtitle: "Toggle platform visual appearance",
      icon: theme === "dark" ? Sun : Moon,
      action: () => {
        setTheme(theme === "dark" ? "light" : "dark");
        onClose();
      },
    },
    {
      id: "support",
      title: "Help & Support",
      subtitle: "Access documentation, FAQs, and support ticket desk",
      icon: HelpCircle,
      action: () => {
        router.push("/dashboard/support");
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard navigation & global Cmd+K listener
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open triggered from parent state
        }
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    },
    [isOpen, onClose, filteredCommands, selectedIndex]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Reset query on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative w-full max-w-xl rounded-2xl border border-border/60 bg-card/95 shadow-2xl backdrop-blur-2xl overflow-hidden text-left"
          >
            {/* Search Header */}
            <div className="flex items-center gap-3 border-b border-border/40 px-4 py-3.5">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command or search workspace... (Cmd+K)"
                className="w-full bg-transparent text-sm font-medium placeholder:text-muted-foreground/60 focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Command List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredCommands.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground font-medium">
                  No commands found matching "{query}"
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer",
                        isSelected
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-foreground hover:bg-accent/40"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted/40 text-muted-foreground border-border/40"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate flex items-center gap-2">
                            {cmd.title}
                            {cmd.badge && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                                {cmd.badge}
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">{cmd.subtitle}</p>
                        </div>
                      </div>
                      <ArrowRight className={cn("h-4 w-4 shrink-0 transition-transform", isSelected ? "translate-x-0.5 opacity-100" : "opacity-0")} />
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border/40 bg-muted/20 px-4 py-2 flex items-center justify-between text-[10px] text-muted-foreground font-medium">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-background border border-border shadow-xs text-[9px]">↑</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-background border border-border shadow-xs text-[9px]">↓</kbd>
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-background border border-border shadow-xs text-[9px]">↵</kbd>
                  to select
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-background border border-border shadow-xs text-[9px]">ESC</kbd>
                to close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
