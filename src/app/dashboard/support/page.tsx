"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, where, getDocs, addDoc, onSnapshot, serverTimestamp, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { HelpCircle, Plus, Search, Filter, Loader2, Send, CheckCircle2, AlertCircle, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ticketSchema = z.object({
  subject: z.string().min(1, "Subject is required.").min(5, "Subject must be at least 5 characters."),
  message: z.string().min(1, "Message details are required.").min(10, "Details must be at least 10 characters."),
  priority: z.enum(["low", "medium", "high"]),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: "open" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: Timestamp | null;
}

export default function SupportPage() {
  const { user } = useAuthStore();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "open" | "closed">("all");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: "",
      message: "",
      priority: "medium",
    },
  });

  // Sync tickets list dynamically from Firestore database
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "supportTickets"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loaded: SupportTicket[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          loaded.push({
            id: doc.id,
            subject: data.subject,
            message: data.message,
            status: data.status || "open",
            priority: data.priority || "medium",
            createdAt: data.createdAt as Timestamp,
          });
        });
        setTickets(loaded);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore tickets sync error:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const onSubmit = async (data: TicketFormValues) => {
    if (!user) return;
    setCreating(true);
    try {
      await addDoc(collection(db, "supportTickets"), {
        userId: user.uid,
        subject: data.subject,
        message: data.message,
        priority: data.priority,
        status: "open",
        createdAt: serverTimestamp(),
      });

      toast.success("Support ticket created successfully!");
      reset();
      // Auto-focus the new list
      setActiveTab("open");
    } catch (err) {
      console.error("Failed to commit support ticket:", err);
      toast.error("Unable to submit support ticket. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (activeTab === "all") return true;
    return t.status === activeTab;
  });

  return (
    <div className="space-y-8 text-left max-w-5xl">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight">Customer Support</h1>
        <p className="text-sm text-muted-foreground">Submit inquiries or track replies for active customer support tickets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Ticket Creator form */}
        <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-6 shadow-sm h-fit space-y-4">
          <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
            <HelpCircle className="h-4.5 w-4.5 text-primary" />
            Submit Support Ticket
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1.5">
              <label className="text-muted-foreground">Subject Title</label>
              <input
                type="text"
                placeholder="e.g., DNS error on custom domain"
                disabled={creating}
                className={cn(
                  "w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45 focus:border-primary",
                  errors.subject && "border-destructive focus:ring-destructive/30"
                )}
                {...register("subject")}
              />
              {errors.subject && (
                <p className="text-[10px] text-destructive">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-muted-foreground">Priority Severity</label>
              <select
                disabled={creating}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                {...register("priority")}
              >
                <option value="low">Low - General Question</option>
                <option value="medium">Medium - Bug Report</option>
                <option value="high">High - Site Outage</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-muted-foreground">Inquiry Details</label>
              <textarea
                rows={5}
                placeholder="Explain the technical issue or general inquiry with enough detail..."
                disabled={creating}
                className={cn(
                  "w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45 focus:border-primary resize-none",
                  errors.message && "border-destructive"
                )}
                {...register("message")}
              />
              {errors.message && (
                <p className="text-[10px] text-destructive">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={creating}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all"
            >
              {creating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Submit Ticket
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Active tickets catalog */}
        <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4 flex-wrap gap-3">
            <h3 className="font-bold text-foreground text-sm">Ticket Registry</h3>
            
            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 text-[10px] font-bold">
              {(["all", "open", "closed"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "rounded px-2.5 py-1 uppercase tracking-wider border border-border transition-colors",
                    activeTab === tab ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-2">
              <Loader2 className="h-8 w-8 animate-spin opacity-45" />
              <p className="text-xs">Loading support history...</p>
            </div>
          ) : filteredTickets.length > 0 ? (
            <div className="space-y-3">
              {filteredTickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className="flex items-center justify-between rounded-xl border border-border p-4 hover:border-primary/45 transition-colors cursor-pointer group bg-card"
                >
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-foreground text-xs">{t.subject}</h4>
                      <span className={cn(
                        "rounded px-2 py-0.5 text-[9px] font-bold uppercase",
                        t.priority === "high" ? "bg-red-500/10 text-red-500" :
                        t.priority === "medium" ? "bg-amber-500/10 text-amber-500" :
                        "bg-green-500/10 text-green-500"
                      )}>
                        {t.priority}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground block truncate max-w-[280px]">
                      {t.message}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase border",
                      t.status === "open" ? "border-green-500/25 bg-green-500/10 text-green-500" : "border-border bg-secondary text-muted-foreground"
                    )}>
                      {t.status}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-2 text-center">
              <HelpCircle className="h-10 w-10 opacity-35" />
              <p className="text-xs font-semibold">No tickets found.</p>
              <p className="text-[10px] max-w-xs">If you have technical difficulties, submit a ticket using the form on the left.</p>
            </div>
          )}
        </div>

      </div>

      {/* Ticket detail modal dialog */}
      <AnimatePresence>
        {selectedTicket && (
          <>
            <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setSelectedTicket(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-start border-b border-border pb-3">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-foreground">{selectedTicket.subject}</h3>
                  <div className="flex gap-2 text-[9px] font-bold uppercase">
                    <span className={cn(
                      "rounded px-2 py-0.5",
                      selectedTicket.priority === "high" ? "bg-red-500/10 text-red-500" :
                      selectedTicket.priority === "medium" ? "bg-amber-500/10 text-amber-500" :
                      "bg-green-500/10 text-green-500"
                    )}>
                      {selectedTicket.priority} Priority
                    </span>
                    <span className={cn(
                      "rounded px-2 py-0.5",
                      selectedTicket.status === "open" ? "bg-green-500/10 text-green-500" : "bg-secondary text-muted-foreground"
                    )}>
                      {selectedTicket.status}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="rounded-lg p-1 hover:bg-muted">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="space-y-2 text-xs leading-relaxed text-muted-foreground p-3.5 bg-secondary/35 rounded-xl border border-border">
                <span className="font-bold text-[10px] text-foreground uppercase block">Inquiry Content</span>
                <p>{selectedTicket.message}</p>
              </div>

              <div className="pt-2 text-[10px] text-muted-foreground flex justify-between">
                <span>Submitted at</span>
                <span className="font-bold text-foreground">
                  {selectedTicket.createdAt ? selectedTicket.createdAt.toDate().toLocaleString() : "Recently"}
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
