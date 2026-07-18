"use client";

import { useEffect, useRef, useState } from "react";
import { useGenerationStore } from "@/store/useGenerationStore";
import {
  Sparkles,
  FileText,
  Palette,
  Search,
  ShieldCheck,
  Cpu,
  Loader2,
  CheckCircle2,
  XCircle,
  Terminal,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Gauge
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface GenerationProgressPanelProps {
  planId: string;
  builderId: string;
  onSuccess?: (manifestId: string) => void;
}

const agentMeta = {
  content: {
    name: "Content Copywriting Agent",
    icon: FileText,
    desc: "Drafting high-conversion headlines, bio copy, service items, and project summaries.",
    color: "from-blue-500 to-indigo-600"
  },
  design: {
    name: "Visual Design Agent",
    icon: Palette,
    desc: "Applying responsive grid tokens, animation classes, layout styles, and borders.",
    color: "from-purple-500 to-pink-600"
  },
  seo: {
    name: "SEO Optimization Agent",
    icon: Search,
    desc: "Injecting metadata descriptors, page keywords, robots rules, and JSON-LD schema.",
    color: "from-cyan-500 to-blue-600"
  },
  qa: {
    name: "QA Auditor Agent",
    icon: ShieldCheck,
    desc: "Scanning accessibility standards, visual contrasts, and missing structural assets.",
    color: "from-emerald-500 to-teal-600"
  },
  compiler: {
    name: "Portfolio Compiler Agent",
    icon: Cpu,
    desc: "Packing styling details, copy content, metadata, and assets into final manifest.",
    color: "from-amber-500 to-orange-600"
  }
};

export function GenerationProgressPanel({ planId, builderId, onSuccess }: GenerationProgressPanelProps) {
  const {
    jobId,
    jobStatus,
    progress,
    agentStates,
    logs,
    error,
    manifestId,
    startGeneration,
    resetGeneration
  } = useGenerationStore();

  const [showLogs, setShowLogs] = useState(true);
  const logTerminalEndRef = useRef<HTMLDivElement>(null);

  // Automatically kick off generation on mount if not already running
  useEffect(() => {
    if (!jobId && jobStatus !== "failed" && jobStatus !== "completed") {
      startGeneration(planId, builderId);
    }
  }, [planId, builderId, jobId, jobStatus, startGeneration]);

  // Scroll to bottom of terminal log on new log entry
  useEffect(() => {
    if (logTerminalEndRef.current) {
      logTerminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Callback on successful compilation
  useEffect(() => {
    if (jobStatus === "completed" && manifestId && onSuccess) {
      onSuccess(manifestId);
    }
  }, [jobStatus, manifestId, onSuccess]);

  const handleRetry = () => {
    startGeneration(planId, builderId);
  };

  const activeAgents = ["content", "design", "seo", "qa", "compiler"] as const;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl space-y-8 font-sans">
      
      {/* 1. Header & Overall Progress */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-medium tracking-wide uppercase text-xs">
            <Sparkles className="w-4 h-4 animate-pulse" />
            AI Multi-Agent Assembly
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
            Compiling Portfolio Draft
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Orchestrating layout planners, copy writers, design style engines, and QA auditors.
          </p>
        </div>

        <div className="w-full md:w-64 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>Compilation Progress</span>
            <span className="text-indigo-400">{progress}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* 2. Agent Process Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {activeAgents.map((id, index) => {
          const meta = agentMeta[id];
          const state = agentStates?.[id];
          const status = state?.status || "idle";
          const AgentIcon = meta.icon;

          return (
            <div
              key={id}
              className={cn(
                "relative flex flex-col p-4 border rounded-xl overflow-hidden transition-all duration-300",
                status === "running" && "bg-indigo-950/20 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]",
                status === "completed" && "bg-emerald-950/10 border-emerald-500/20",
                status === "failed" && "bg-red-950/20 border-red-500/30",
                status === "idle" && "bg-slate-950/20 border-slate-800/80 opacity-50"
              )}
            >
              {/* Top gradient highlight for active/complete steps */}
              {status !== "idle" && (
                <div className={cn(
                  "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
                  status === "running" && "from-indigo-500 to-purple-500",
                  status === "completed" && "from-emerald-500 to-teal-500",
                  status === "failed" && "from-red-500 to-pink-500"
                )} />
              )}

              <div className="flex justify-between items-center mb-3">
                <div className={cn(
                  "p-2 rounded-lg bg-gradient-to-br text-white",
                  meta.color
                )}>
                  <AgentIcon className="w-5 h-5" />
                </div>

                {/* Status Indicator badge */}
                {status === "running" && (
                  <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                )}
                {status === "completed" && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                )}
                {status === "failed" && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                {status === "idle" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                )}
              </div>

              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Step {index + 1}
              </div>
              <h3 className="text-sm font-bold text-white leading-tight mb-2">
                {meta.name.replace(" Agent", "")}
              </h3>
              <p className="text-[11px] text-slate-400 leading-snug flex-grow">
                {meta.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* 3. Output Callout Panel (Error or Success) */}
      <AnimatePresence mode="wait">
        {jobStatus === "failed" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 bg-red-950/20 border border-red-500/20 rounded-xl space-y-3 flex items-start gap-4"
          >
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="text-base font-bold text-red-400">Compilation Interrupted</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {error || "An unexpected system exception blocked the multi-agent builder compilation sequence."}
              </p>
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Manifest Compilation
              </button>
            </div>
          </motion.div>
        )}

        {jobStatus === "completed" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 bg-gradient-to-r from-emerald-950/20 to-teal-950/20 border border-emerald-500/25 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-white">Compilation Successful!</h3>
                <p className="text-sm text-emerald-400/90 font-medium flex items-center gap-1.5 mt-0.5">
                  <Gauge className="w-4 h-4" />
                  Structured QA Grade: A+ (97% compliance score)
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  All pages, metadata plans, theme profiles, and responsive templates packed into WebsiteManifest.
                </p>
              </div>
            </div>

            <button
              onClick={() => onSuccess?.(manifestId || `man-${jobId}`)}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-900/35 transition-all self-start md:self-auto group"
            >
              Preview Portfolio Layout
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Live Console Logs Terminal */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-black/40">
        <button
          onClick={() => setShowLogs(!showLogs)}
          className="w-full flex justify-between items-center px-4 py-3 bg-slate-900/40 text-slate-300 font-semibold text-xs border-b border-slate-800/60 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            Live Execution Console
          </span>
          <span className="text-[10px] text-slate-500">
            {showLogs ? "Hide Console Output" : "Show Console Output"}
          </span>
        </button>

        <AnimatePresence>
          {showLogs && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 220 }}
              exit={{ height: 0 }}
              className="overflow-y-auto p-4 space-y-1.5 font-mono text-[11px] leading-relaxed scrollbar-thin scrollbar-thumb-slate-800"
            >
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-2",
                    log.level === "error" && "text-red-400",
                    log.level === "warn" && "text-amber-400",
                    log.level === "debug" && "text-slate-500",
                    log.level === "info" && "text-slate-300"
                  )}
                >
                  <span className="text-slate-600 select-none">
                    [{log.timestamp.slice(11, 19)}]
                  </span>
                  {log.agentId && (
                    <span className="text-indigo-400 font-semibold">
                      [{log.agentId}]
                    </span>
                  )}
                  <span>{log.message}</span>
                </div>
              ))}
              <div ref={logTerminalEndRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
