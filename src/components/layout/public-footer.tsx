"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Globe, Share2, Code2, CheckCircle2 } from "lucide-react";

export function PublicFooter() {
  const pathname = usePathname();

  // Hide footer on admin and dashboard routes
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="border-t border-border bg-card/60 backdrop-blur-md pt-16 pb-12 text-left relative overflow-hidden">
      {/* Glow background accent */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-border">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-foreground">
                BuildMyPortfolio
              </span>
            </Link>

            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              The AI-powered portfolio platform designed for developers, designers, founders, and executives to build world-class personal websites in seconds.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              All Systems Operational
            </div>
          </div>

          {/* Product Col */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-foreground uppercase tracking-wider text-[10px]">Product</h4>
            <ul className="space-y-2.5 text-muted-foreground font-medium">
              <li><Link href="/features" className="hover:text-foreground transition-colors">AI Compiler</Link></li>
              <li><Link href="/templates" className="hover:text-foreground transition-colors">Template Gallery</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing Plans</Link></li>
              <li><Link href="/showcase" className="hover:text-foreground transition-colors">Showcase &amp; Live Sites</Link></li>
            </ul>
          </div>

          {/* Company Col */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-foreground uppercase tracking-wider text-[10px]">Company</h4>
            <ul className="space-y-2.5 text-muted-foreground font-medium">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About Story</Link></li>
              <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ &amp; Help Desk</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Sales</Link></li>
            </ul>
          </div>

          {/* Legal Col */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-foreground uppercase tracking-wider text-[10px]">Legal &amp; Security</h4>
            <ul className="space-y-2.5 text-muted-foreground font-medium">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/admin" className="hover:text-foreground transition-colors">Admin Console</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} BuildMyPortfolio Platform. Built for creators worldwide.</p>
          <div className="flex items-center gap-4 text-foreground">
            <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-violet-500" /> Global Edge CDN</span>
            <span className="flex items-center gap-1"><Code2 className="w-3.5 h-3.5 text-cyan-500" /> Open Source Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
