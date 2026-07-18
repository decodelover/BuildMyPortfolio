"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Mail, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.003z" />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const footerLinks = {
    product: [
      { label: "Features", href: "/features" },
      { label: "Templates", href: "/templates" },
      { label: "Showcase", href: "/showcase" },
      { label: "Pricing", href: "/pricing" },
    ],
    resources: [
      { label: "FAQ / Support", href: "/faq" },
      { label: "Developer Guides", href: "/faq" },
      { label: "API Reference", href: "/faq" },
      { label: "Integrations", href: "/features" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Mission", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Partner Network", href: "/about" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "DMCA Notice", href: "/terms" },
      { label: "Security Policy", href: "/privacy" },
    ],
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    // Simulate API registration
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    toast.success("Thank you! You have been successfully subscribed to our newsletter.");
    setEmail("");
  };

  return (
    <footer className="w-full border-t border-border/40 bg-secondary/15 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Info */}
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-black text-lg tracking-tight select-none">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-accent text-primary-foreground shadow-md shadow-primary/20">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent">
                BuildMyPortfolio
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Empowering technology professionals, designers, and developers to build and deploy high-fidelity professional websites with advanced AI.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-5 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors duration-200" aria-label="Follow us on X">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors duration-200" aria-label="Visit our GitHub">
                <GitHubIcon className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors duration-200" aria-label="Follow us on LinkedIn">
                <LinkedInIcon className="h-5 w-5" />
              </a>
              <a href="mailto:support@buildmyportfolio.com" className="hover:text-primary transition-colors duration-200" aria-label="Email support">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links and Newsletter Container */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            {/* Nav Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xs font-bold tracking-wider uppercase text-foreground/80">Product</h3>
                <ul className="mt-4 space-y-2.5">
                  {footerLinks.product.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-wider uppercase text-foreground/80">Resources</h3>
                <ul className="mt-4 space-y-2.5">
                  {footerLinks.resources.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-wider uppercase text-foreground/80">Company</h3>
                <ul className="mt-4 space-y-2.5">
                  {footerLinks.company.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-wider uppercase text-foreground/80">Legal</h3>
                <ul className="mt-4 space-y-2.5">
                  {footerLinks.legal.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="flex flex-col space-y-4 max-w-sm">
              <h3 className="text-xs font-bold tracking-wider uppercase text-foreground/80">Subscribe to our newsletter</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Stay updated with modern portfolio advice, SEO updates, template release announcements, and product innovations.
              </p>
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 pr-10"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-1.5 p-1.5 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground transition-colors cursor-pointer"
                  aria-label="Subscribe button"
                >
                  {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Bottom copyright */}
        <div className="mt-12 border-t border-border/40 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} BuildMyPortfolio Inc. All rights reserved. Made by tech professionals, for tech professionals.
          </p>
          <div className="flex items-center gap-6 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
