"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { PortfolioRenderer } from "@/components/portfolio-renderer/PortfolioRenderer";
import { Loader2 } from "lucide-react";

export default function PortfolioPreviewPage() {
  const params = useParams();
  const builderId = params?.builderId as string;

  const [blueprint, setBlueprint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!builderId) return;

    async function loadPortfolio() {
      try {
        setLoading(true);
        // Try websiteManifests first
        const manifestRef = doc(db, "websiteManifests", `man-${builderId}`);
        const manifestSnap = await getDoc(manifestRef);

        if (manifestSnap.exists()) {
          setBlueprint(manifestSnap.data());
        } else {
          // Fallback check builder doc
          const builderRef = doc(db, "websiteBuilders", builderId);
          const builderSnap = await getDoc(builderRef);
          if (builderSnap.exists() && builderSnap.data().manifest) {
            setBlueprint(builderSnap.data().manifest);
          } else {
            setError("Portfolio website manifest not found. Please complete the generation step in your dashboard.");
          }
        }
      } catch (err: any) {
        console.error("Preview load error:", err);
        setError("Failed to load portfolio manifest.");
      } finally {
        setLoading(false);
      }
    }

    loadPortfolio();
  }, [builderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Rendering Portfolio Website...</p>
      </div>
    );
  }

  if (error || !blueprint) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Preview Not Available</h2>
          <p className="text-sm text-muted-foreground">{error || "No compiled portfolio blueprint found."}</p>
        </div>
      </div>
    );
  }

  return <PortfolioRenderer blueprint={blueprint} />;
}
