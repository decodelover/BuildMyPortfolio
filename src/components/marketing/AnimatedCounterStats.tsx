"use client";

import { motion } from "framer-motion";
import { Globe, ShieldCheck, Zap, Award } from "lucide-react";

export function AnimatedCounterStats() {
  const stats = [
    { label: "Portfolios Compiled", value: "28,400+", icon: Globe, color: "text-primary" },
    { label: "Live CDN Uptime SLA", value: "99.9%", icon: ShieldCheck, color: "text-emerald-500" },
    { label: "Average LCP Speed", value: "< 0.8s", icon: Zap, color: "text-accent" },
    { label: "Lighthouse & WCAG Score", value: "100/100", icon: Award, color: "text-purple-400" },
  ];

  return (
    <section className="py-12 bg-card/40 border-y border-border/40 relative overflow-hidden select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-4 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl space-y-2"
              >
                <Icon className={`h-5 w-5 mx-auto ${s.color}`} />
                <p className="text-2xl sm:text-3xl font-black text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground font-bold">{s.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
