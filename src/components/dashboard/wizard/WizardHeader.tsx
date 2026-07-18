"use client";

import { useRouter } from "next/navigation";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { SaveStatus } from "./SaveStatus";
import { Sparkles, LogOut, FileText, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

export function WizardHeader() {
  const router = useRouter();
  const { unsavedChanges, saveBuilderDraft } = useWebsiteBuilderStore();

  const handleExit = async () => {
    try {
      if (unsavedChanges) {
        toast.info("Saving your changes before exiting...", { duration: 2000 });
        await saveBuilderDraft(true);
      }
      toast.success("Progress saved successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Error exiting wizard:", err);
      toast.error("Failed to save changes. Exit anyway?", {
        action: {
          label: "Exit",
          onClick: () => router.push("/dashboard"),
        },
      });
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      {/* Brand & Exit Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleExit}
          className="flex items-center gap-1.5 rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          aria-label="Go back to dashboard"
        >
          <ChevronLeft className="h-4.5 w-4.5" />
          <span className="hidden sm:inline text-xs font-bold">Exit Builder</span>
        </button>
        
        <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-border">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
          </div>
          <span className="text-sm font-black tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            BuildMyPortfolio
          </span>
        </div>
      </div>

      {/* Title Centered on Desktop */}
      <div className="hidden lg:block text-xs font-bold text-muted-foreground uppercase tracking-widest">
        AI Website Builder Wizard
      </div>

      {/* Sync Status & Navigation Action */}
      <div className="flex items-center gap-3">
        <SaveStatus />
        
        <button
          onClick={handleExit}
          className="flex items-center gap-1.5 rounded-xl bg-secondary px-3.5 py-1.5 text-xs font-bold text-secondary-foreground hover:bg-secondary/80 transition-colors shadow-sm cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Continue Later</span>
        </button>

        <button
          onClick={async () => {
            await saveBuilderDraft(true);
            toast.success("Draft saved manually!");
          }}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/95 transition-colors shadow-sm cursor-pointer"
        >
          <FileText className="h-3.5 w-3.5 text-accent" />
          <span>Save Draft</span>
        </button>
      </div>
    </header>
  );
}
export default WizardHeader;
