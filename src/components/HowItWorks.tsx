"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Install the Plugin",
    description: "Add the Vibe plugin to Roblox Studio. One click install from the Creator Store — it runs silently in the background.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Connect & Describe",
    description: 'Open the Vibe web app and connect to your Studio session. Then just type what you want — "add a racing track with checkpoints and a leaderboard."',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Watch It Build",
    description: "The AI reads your scene, generates the Luau scripts and instances, and syncs everything into Studio. Iterate with follow-up prompts.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-4 py-32 md:py-40">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-24"
        >
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6" style={{ backgroundColor: "var(--tag-bg)", borderWidth: 1, borderColor: "var(--tag-border)" }}>
            <span className="text-[11px] uppercase tracking-[0.2em] font-medium" style={{ color: "var(--text-secondary)" }}>How It Works</span>
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
            Three steps to launch
          </h2>
        </motion.div>

        <div className="space-y-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="group rounded-[2rem] p-1.5 transition-theme border" style={{ backgroundColor: "var(--bg-overlay)", borderColor: "var(--edge)" }}>
                <div className="rounded-[calc(2rem-0.375rem)] border p-8 md:p-12 flex flex-col md:flex-row items-start gap-8 transition-theme" style={{ backgroundColor: "var(--card)", borderColor: "var(--edge)", boxShadow: `inset 0 1px 1px var(--inset)` }}>
                  <div className="flex items-center gap-5 shrink-0">
                    <span className="text-[48px] md:text-[56px] font-bold leading-none tracking-tighter" style={{ color: "var(--number-color)" }}>
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110">
                      {step.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight mb-3" style={{ color: "var(--text)" }}>
                      {step.title}
                    </h3>
                    <p className="text-[15px] leading-relaxed font-light max-w-xl" style={{ color: "var(--text-muted)" }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
