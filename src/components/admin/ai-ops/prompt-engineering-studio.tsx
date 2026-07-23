"use client";

import React, { useEffect, useState } from "react";
import { AIPromptTemplate } from "@/types/admin-ai-ops";
import { Code, GitBranch, Play, RefreshCw, Save, RotateCcw, CheckCircle2, Tag, Sparkles } from "lucide-react";

export function PromptEngineeringStudio() {
  const [prompts, setPrompts] = useState<AIPromptTemplate[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<AIPromptTemplate | null>(null);
  const [templateText, setTemplateText] = useState("");
  const [changeNotes, setChangeNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchPrompts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/ai-ops/prompts");
      if (res.ok) {
        const data = await res.json();
        setPrompts(data.prompts || []);
        if (data.prompts?.length > 0 && !selectedPrompt) {
          const first = data.prompts[0];
          setSelectedPrompt(first);
          setTemplateText(first.versions[0]?.templateText || "");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const handleSelectPrompt = (prompt: AIPromptTemplate) => {
    setSelectedPrompt(prompt);
    setTemplateText(prompt.versions[0]?.templateText || "");
  };

  const handleSavePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPrompt) return;

    try {
      const res = await fetch("/api/admin/ai-ops/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptId: selectedPrompt.id,
          templateText,
          changeNotes,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage(`New prompt template version created successfully.`);
        setTimeout(() => setStatusMessage(null), 4000);
        setChangeNotes("");
        fetchPrompts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRollback = async (targetVersion: string) => {
    if (!selectedPrompt) return;
    try {
      const res = await fetch("/api/admin/ai-ops/prompts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptId: selectedPrompt.id,
          targetVersion,
        }),
      });
      if (res.ok) {
        setStatusMessage(`Rolled back to version ${targetVersion}.`);
        setTimeout(() => setStatusMessage(null), 4000);
        fetchPrompts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Code className="w-4 h-4 text-primary" /> Prompt Engineering &amp; Versioning Studio
          </h3>
          <p className="text-xs text-muted-foreground">Manage centralized prompt templates, token efficiency scores, version histories, and rollbacks.</p>
        </div>

        <button onClick={fetchPrompts} className="p-2 rounded-xl bg-secondary border border-border">
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {statusMessage}
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Prompts List Sidebar */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Prompt Templates</h4>
          <div className="space-y-2">
            {prompts.map((p) => {
              const isSelected = selectedPrompt?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPrompt(p)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all text-xs space-y-1 ${
                    isSelected ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{p.name}</span>
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                      {p.currentVersion}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{p.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Editor Area */}
        {selectedPrompt ? (
          <div className="md:col-span-2 space-y-4">
            <form onSubmit={handleSavePrompt} className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h4 className="text-sm font-bold text-foreground">{selectedPrompt.name}</h4>
                  <span className="text-[11px] text-muted-foreground font-semibold">Category: {selectedPrompt.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Token Score: {selectedPrompt.tokenEfficiencyScore}/100
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-muted-foreground block mb-1">Template Code &amp; Variable Declarations</label>
                <textarea
                  value={templateText}
                  onChange={(e) => setTemplateText(e.target.value)}
                  rows={7}
                  required
                  className="w-full p-3 font-mono text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed"
                />
              </div>

              <div>
                <label className="font-bold text-muted-foreground block mb-1">Version Release Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Added constraint rules for JSON output formatting..."
                  value={changeNotes}
                  onChange={(e) => setChangeNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-muted-foreground">Total usages: {selectedPrompt.usageCount}</span>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-primary text-primary-foreground rounded-xl shadow-xs hover:opacity-90"
                >
                  <Save className="w-3.5 h-3.5" /> Save &amp; Publish Version
                </button>
              </div>
            </form>

            {/* Version History Table */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3">
              <h5 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-primary" /> Version History &amp; Rollback
              </h5>

              <div className="space-y-2 text-xs">
                {selectedPrompt.versions.map((ver) => (
                  <div key={ver.version} className="p-3 rounded-xl border border-border bg-background flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary">{ver.version}</span>
                        <span className="text-[11px] text-muted-foreground">Released on {ver.createdAt} by {ver.updatedByAdmin}</span>
                      </div>
                      <p className="text-[11px] text-foreground font-medium">{ver.changeNotes}</p>
                    </div>

                    {ver.version !== selectedPrompt.currentVersion && (
                      <button
                        onClick={() => handleRollback(ver.version)}
                        className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded-lg hover:bg-amber-500/20"
                      >
                        <RotateCcw className="w-3 h-3" /> Rollback
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
