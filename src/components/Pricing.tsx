"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying Vibe and small projects.",
    features: ["50 AI prompts / month", "Studio plugin access", "Basic game systems", "Community support"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    description: "For serious creators building published games.",
    features: ["Unlimited AI prompts", "Priority generation speed", "Advanced systems (combat, economy, AI NPCs)", "Scene context awareness", "Priority support"],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/ month",
    description: "Collaborate on games with your team.",
    features: ["Everything in Pro", "5 team seats included", "Shared project history", "Custom system templates", "Dedicated support"],
    cta: "Contact Us",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative px-4 py-32 md:py-40">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6" style={{ backgroundColor: "var(--tag-bg)", borderWidth: 1, borderColor: "var(--tag-border)" }}>
            <span className="text-[11px] uppercase tracking-[0.2em] font-medium" style={{ color: "var(--text-secondary)" }}>Pricing</span>
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
            Start free, scale up
          </h2>
          <p className="mt-5 text-lg max-w-lg mx-auto font-light" style={{ color: "var(--text-muted)" }}>
            No credit card required. Upgrade when you need more.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.32, 0.72, 0, 1] }}
            >
              <div
                className="h-full rounded-[2rem] p-1.5 transition-theme border"
                style={{
                  background: plan.highlighted
                    ? `linear-gradient(to bottom, var(--pricing-highlight-from), var(--pricing-highlight-to))`
                    : "var(--bg-overlay)",
                  borderColor: plan.highlighted ? "var(--pricing-highlight-border)" : "var(--edge)",
                }}
              >
                <div className="h-full rounded-[calc(2rem-0.375rem)] border p-8 flex flex-col transition-theme" style={{ backgroundColor: "var(--card)", borderColor: "var(--edge)", boxShadow: `inset 0 1px 1px var(--inset)` }}>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>{plan.name}</h3>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-bold tracking-tight" style={{ color: "var(--text)" }}>{plan.price}</span>
                      <span className="text-sm font-light" style={{ color: "var(--text-muted)" }}>{plan.period}</span>
                    </div>
                    <p className="mt-3 text-[13px] font-light" style={{ color: "var(--text-muted)" }}>{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-[14px]" style={{ color: "var(--text-secondary)" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/studio"
                    className={`group flex items-center justify-center gap-2 rounded-full py-3.5 text-[14px] font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] ${
                      plan.highlighted
                        ? "bg-accent text-white hover:shadow-[0_0_30px_rgba(124,92,252,0.3)]"
                        : ""
                    }`}
                    style={!plan.highlighted ? { backgroundColor: "var(--bg-overlay)", color: "var(--text-secondary)" } : undefined}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
