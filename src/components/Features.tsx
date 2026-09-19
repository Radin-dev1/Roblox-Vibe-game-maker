"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Live Studio Sync",
    description:
      "Every change the AI makes instantly appears in your Roblox Studio session. Watch your game build itself in real-time.",
    accent: "#7c5cfc",
    span: "md:col-span-8 md:row-span-2",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Natural Language",
    description: "Just describe what you want. No coding needed.",
    accent: "#00d4aa",
    span: "md:col-span-4 md:row-span-1",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
    title: "Full Game Systems",
    description: "Combat, UI, inventory, NPCs — full feature sets, not snippets.",
    accent: "#ff6b6b",
    span: "md:col-span-4 md:row-span-1",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    title: "Context Aware",
    description:
      "The AI understands your existing game. It reads your scene before making changes so nothing breaks.",
    accent: "#fbbf24",
    span: "md:col-span-5 md:row-span-1",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: "Script Generation",
    description:
      "Luau scripts generated, tested, and inserted — clean, performant code every time.",
    accent: "#a78bfa",
    span: "md:col-span-7 md:row-span-1",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] },
  },
};

export default function Features() {
  return (
    <section id="features" className="relative px-4 py-32 md:py-40">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/[0.06] px-4 py-1.5 mb-6">
            <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-white/50">
              Features
            </span>
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Everything you need
          </h2>
          <p className="mt-5 text-lg text-white/35 max-w-lg mx-auto font-light">
            From a single prompt to a fully functional game system,
            synced to Studio in seconds.
          </p>
        </motion.div>

        {/* Asymmetrical Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className={`${feature.span} group`}
            >
              {/* Double-bezel outer shell */}
              <div className="h-full rounded-[2rem] bg-white/[0.02] border border-white/[0.05] p-1.5 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/[0.1] hover:bg-white/[0.03]">
                {/* Inner core */}
                <div className="h-full rounded-[calc(2rem-0.375rem)] bg-[#0a0a0a] border border-white/[0.03] shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] p-8 md:p-10 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110"
                    style={{ backgroundColor: `${feature.accent}15`, color: feature.accent }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[15px] text-white/35 leading-relaxed font-light">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
