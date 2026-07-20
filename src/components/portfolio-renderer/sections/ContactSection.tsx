import React, { useState } from "react";
import { NormalizedSectionNode } from "@/lib/rendering-engine/types";
import { PortfolioButton } from "../ui/PortfolioButton";
import { PortfolioCard } from "../ui/PortfolioCard";

export function ContactSection({ node }: { node: NormalizedSectionNode }) {
  const content = node.content || {};
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className={`py-16 lg:py-24 ${node.responsiveClasses.containerWidthClass}`}>
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-foreground sm:text-4xl">{content.title || "Get In Touch"}</h2>
          <p className="text-base text-foreground/80 max-w-xl mx-auto">
            {content.subtitle || "Have a project in mind or want to collaborate? Reach out!"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PortfolioCard className="space-y-6">
            <h3 className="text-lg font-bold text-foreground">Contact Information</h3>
            {content.email && (
              <div>
                <span className="text-xs text-muted-foreground block font-semibold">Email</span>
                <a href={`mailto:${content.email}`} className="text-sm font-medium text-primary hover:underline">{content.email}</a>
              </div>
            )}
            {content.phone && (
              <div>
                <span className="text-xs text-muted-foreground block font-semibold">Phone</span>
                <span className="text-sm font-medium text-foreground">{content.phone}</span>
              </div>
            )}
            {content.location && (
              <div>
                <span className="text-xs text-muted-foreground block font-semibold">Location</span>
                <span className="text-sm font-medium text-foreground">{content.location}</span>
              </div>
            )}
          </PortfolioCard>

          <PortfolioCard>
            {submitted ? (
              <div className="p-8 text-center space-y-3">
                <div className="text-2xl">🎉</div>
                <h4 className="text-base font-bold text-foreground">Message Sent!</h4>
                <p className="text-xs text-muted-foreground">Thank you for reaching out. I will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="jane@example.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="How can I help you?"
                  />
                </div>
                <PortfolioButton type="submit" variant="primary" className="w-full">
                  Send Message
                </PortfolioButton>
              </form>
            )}
          </PortfolioCard>
        </div>
      </div>
    </section>
  );
}
