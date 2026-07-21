"use client";

import { useState } from "react";
import { Calculator, Clock, DollarSign, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export function ROICalculator() {
  const [hourlyRate, setHourlyRate] = useState(65);
  const [customPages, setCustomPages] = useState(4);

  // Math estimates
  const hoursSavedManualCoding = customPages * 12; // 12 hrs per custom responsive page
  const totalMoneySaved = hoursSavedManualCoding * hourlyRate;

  return (
    <section className="py-16 sm:py-24 bg-card/40 border-y border-border/40 relative overflow-hidden text-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-extrabold uppercase tracking-wider">
            Interactive ROI Calculator
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Calculate Your Time &amp; Cost Savings
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            See how much engineering time and designer costs you save using BuildMyPortfolio's AI compilation engine.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-3xl border border-border/60 bg-card/80 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Sliders Input */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-foreground">Your Hourly Rate ($/hr):</span>
                <span className="text-primary font-extrabold text-sm">${hourlyRate}/hr</span>
              </div>
              <input
                type="range"
                min={25}
                max={150}
                step={5}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-foreground">Number of Portfolio Sections/Pages:</span>
                <span className="text-accent font-extrabold text-sm">{customPages} Sections</span>
              </div>
              <input
                type="range"
                min={2}
                max={10}
                step={1}
                value={customPages}
                onChange={(e) => setCustomPages(Number(e.target.value))}
                className="w-full accent-accent cursor-pointer"
              />
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              *Based on standard developer time estimates for responsive CSS layout, dark mode, contact forms, SEO metadata, and Vercel CDN setup.
            </p>
          </div>

          {/* Savings Display */}
          <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Estimated Savings Summary</span>
              
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-muted-foreground font-semibold">Engineering Hours Saved:</span>
                  <p className="text-3xl font-black text-foreground flex items-center gap-1.5">
                    <Clock className="h-6 w-6 text-primary" /> {hoursSavedManualCoding} Hours
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-semibold">Development Cost Value Saved:</span>
                  <p className="text-3xl font-black text-emerald-500 flex items-center gap-1.5">
                    <DollarSign className="h-6 w-6" /> ${totalMoneySaved.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/register"
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md hover:opacity-95 transition-opacity"
            >
              Claim Your Time Savings <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
