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
      {/* Mesh gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#7c5cfc]/[0.12] blur-[120px] animate-float-orb" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#00d4aa]/[0.08] blur-[120px] animate-float-orb-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#ff6b6b]/[0.05] blur-[100px] animate-pulse-glow" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Eyebrow tag */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ ...transition, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/[0.06] px-4 py-1.5 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse-glow" />
          <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-white/50">
            Now in Public Beta
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ ...transition, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-[5.5rem] font-bold leading-[0.95] tracking-tight mb-7"
        >
          <span className="block">Build Roblox</span>
          <span className="block mt-2">
            games with{" "}
            <span className="bg-gradient-to-r from-[#7c5cfc] via-[#9b7dff] to-[#00d4aa] bg-clip-text text-transparent animate-gradient-shift">
              AI
            </span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ ...transition, delay: 0.35 }}
          className="text-lg sm:text-xl text-white/40 max-w-xl mx-auto mb-12 leading-relaxed font-light"
        >
          Describe what you want. Our AI connects to Roblox Studio through a
          plugin and builds your game in real-time.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ ...transition, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/studio"
            className="group relative flex items-center gap-3 rounded-full bg-white text-black pl-7 pr-2 py-2.5 text-[15px] font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_0_40px_rgba(124,92,252,0.25)] active:scale-[0.97]"
          >
            <span>Start Building Free</span>
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-black/[0.08] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </Link>

          <a
            href="#how-it-works"
            className="flex items-center gap-2 rounded-full border border-white/[0.08] px-7 py-3.5 text-[15px] text-white/60 hover:text-white/90 hover:border-white/[0.16] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97]"
          >
            <span>See How It Works</span>
          </a>
        </motion.div>

        {/* Terminal preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(16px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ ...transition, delay: 0.7, duration: 1.1 }}
          className="mt-20 mx-auto max-w-2xl"
        >
          {/* Double-bezel card */}
          <div className="rounded-[2rem] bg-white/[0.03] border border-white/[0.06] p-1.5">
            <div className="rounded-[calc(2rem-0.375rem)] bg-[#0a0a0a] border border-white/[0.04] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.04]">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[11px] text-white/20 font-mono">
                    vibe — ai studio
                  </span>
                </div>
              </div>

              {/* Terminal content */}
              <div className="p-6 font-mono text-[13px] leading-relaxed space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-[#7c5cfc]">you</span>
                  <span className="text-white/70">
                    Add a sword fighting system with combos and special attacks
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00d4aa]">vibe</span>
                  <span className="text-white/40">
                    Creating combat system... Adding Tool &quot;Sword&quot; with animations,
                    hitbox detection, 3-hit combo chain, and ultimate ability on
                    full meter...
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#34d399]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-[12px]">
                    Synced to Roblox Studio — 12 instances created
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#7c5cfc]">you</span>
                  <span className="w-[2px] h-4 bg-white/40 animate-cursor" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
