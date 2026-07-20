import React, { useState } from "react";
import { NormalizedSectionNode } from "@/lib/rendering-engine/types";
import { PortfolioButton } from "../ui/PortfolioButton";

export interface NavbarSectionProps {
  node: NormalizedSectionNode;
  mainNav?: Array<{ label: string; target: string; isExternal: boolean }>;
}

export function NavbarSection({ node, mainNav = [] }: NavbarSectionProps) {
  const content = node.content || {};
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2 font-black text-lg text-foreground tracking-tight">
          {content.logoText || "Portfolio"}
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground/80">
          {mainNav.map((item, idx) => (
            <a key={idx} href={item.target} className="hover:text-primary transition-colors">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href="#contact">
            <PortfolioButton variant="primary" size="sm">
              Contact
            </PortfolioButton>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-foreground hover:bg-card focus:outline-none"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border bg-background p-4 space-y-3 text-sm font-medium text-foreground">
          {mainNav.map((item, idx) => (
            <a
              key={idx}
              href={item.target}
              onClick={() => setMobileOpen(false)}
              className="block py-1 hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
