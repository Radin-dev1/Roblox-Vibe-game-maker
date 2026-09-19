"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const transition = {
  duration: 0.9,
  ease: [0.32, 0.72, 0, 1] as const,
};

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] animate-float-orb" style={{ backgroundColor: "var(--orb-1)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] animate-float-orb-delayed" style={{ backgroundColor: "var(--orb-2)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[100px] animate-pulse-glow" style={{ backgroundColor: "var(--orb-3)" }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ ...transition, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 transition-theme"
          style={{ backgroundColor: "var(--tag-bg)", borderWidth: 1, borderColor: "var(--tag-border)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-glow" />
          <span className="text-[11px] uppercase tracking-[0.2em] font-medium" style={{ color: "var(--text-secondary)" }}>
            Now in Public Beta
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ ...transition, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-[5.5rem] font-bold leading-[0.95] tracking-tight mb-7"
          style={{ color: "var(--text)" }}
        >
          <span className="block">Build Roblox</span>
          <span className="block mt-2">
            games with{" "}
            <span className="bg-gradient-to-r from-accent via-accent-glow to-teal bg-clip-text text-transparent animate-gradient-shift">
              AI
            </span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ ...transition, delay: 0.35 }}
          className="text-lg sm:text-xl max-w-xl mx-auto mb-12 leading-relaxed font-light"
          style={{ color: "var(--text-muted)" }}
        >
          Describe what you want. Our AI connects to Roblox Studio through a
          plugin and builds your game in real-time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ ...transition, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/studio"
            className="group relative flex items-center gap-3 rounded-full pl-7 pr-2 py-2.5 text-[15px] font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_0_40px_rgba(124,92,252,0.25)] active:scale-[0.97]"
            style={{ backgroundColor: "var(--cta-bg)", color: "var(--cta-text)" }}
          >
            <span>Start Building Free</span>
            <span className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105"
              style={{ backgroundColor: "var(--bg-overlay)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </Link>

          <a
            href="#how-it-works"
            className="flex items-center gap-2 rounded-full border px-7 py-3.5 text-[15px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97]"
            style={{ borderColor: "var(--edge)", color: "var(--text-secondary)" }}
          >
            See How It Works
          </a>
        </motion.div>

        {/* Terminal preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(16px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ ...transition, delay: 0.7, duration: 1.1 }}
          className="mt-20 mx-auto max-w-2xl"
        >
          <div className="rounded-[2rem] p-1.5 transition-theme" style={{ backgroundColor: "var(--bg-overlay)", borderWidth: 1, borderColor: "var(--edge)" }}>
            <div className="rounded-[calc(2rem-0.375rem)] overflow-hidden transition-theme" style={{ backgroundColor: "var(--card)", borderWidth: 1, borderColor: "var(--edge)", boxShadow: `inset 0 1px 1px var(--inset)` }}>
              <div className="flex items-center gap-2 px-5 py-3.5 border-b" style={{ borderColor: "var(--edge)" }}>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--window-dot)" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--window-dot)" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--window-dot)" }} />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[11px] font-mono" style={{ color: "var(--text-faint)" }}>
                    vibe — ai studio
                  </span>
                </div>
              </div>
              <div className="p-6 font-mono text-[13px] leading-relaxed space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-accent">you</span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    Add a sword fighting system with combos and special attacks
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-teal">vibe</span>
                  <span style={{ color: "var(--text-muted)" }}>
                    Creating combat system... Adding Tool &quot;Sword&quot; with animations,
                    hitbox detection, 3-hit combo chain, and ultimate ability on
                    full meter...
                  </span>
                </div>
                <div className="flex items-center gap-2 text-success">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-[12px]">
                    Synced to Roblox Studio — 12 instances created
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-accent">you</span>
                  <span className="w-[2px] h-4 animate-cursor" style={{ backgroundColor: "var(--text-muted)" }} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
