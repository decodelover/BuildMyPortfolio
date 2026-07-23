"use client";

import React, { useState } from "react";
import { Sparkles, Mail, MessageSquare, Send, CheckCircle2, PhoneCall, Building } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "General Inquiry", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pt-32 pb-24 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold">
            <Mail className="w-4 h-4" /> Contact &amp; Support
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
            We'd Love to Hear From You
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Have questions about custom enterprise billing, domain setup, or feature requests? Get in touch with our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2 p-8 rounded-3xl border border-border bg-card shadow-sm space-y-6">
            {submitted ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Message Delivered!</h3>
                <p className="text-xs text-muted-foreground">Thank you for reaching out. Our team will respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground uppercase text-[10px]">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground uppercase text-[10px]">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground uppercase text-[10px]">Inquiry Type</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-3 rounded-xl bg-background border border-border focus:outline-none font-bold"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Enterprise Sales">Enterprise Sales / Team License</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Feature Request">Feature Request</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground uppercase text-[10px]">Message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full py-3.5 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-cyan-600 rounded-xl shadow-md"
                >
                  <Send className="w-3.5 h-3.5" /> Send Message
                </button>
              </form>
            )}
          </div>

          {/* Info sidebar */}
          <div className="space-y-6 text-xs">
            <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-3">
              <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                <Building className="w-4 h-4 text-violet-600" /> Enterprise Sales
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                Need team licenses, custom SLA guarantees, or SOC2 compliance packages? Contact our enterprise team.
              </p>
              <a href="mailto:sales@buildmyportfolio.dev" className="text-violet-600 font-bold block pt-2">
                sales@buildmyportfolio.dev →
              </a>
            </div>

            <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-3">
              <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-600" /> Customer Helpdesk
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                Our support agents respond within 24 hours. Check our Knowledge Base for quick answers.
              </p>
              <a href="mailto:support@buildmyportfolio.dev" className="text-cyan-600 font-bold block pt-2">
                support@buildmyportfolio.dev →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
