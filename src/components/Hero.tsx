"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const transition = { duration: 0.8, ease: [0.32, 0.72, 0, 1] as const };

const sceneRows = [
  ["Workspace", "18 parts", "#7c5cfc"],
  ["ReplicatedStorage", "4 modules", "#00d4aa"],
  ["ServerScriptService", "3 scripts", "#fbbf24"],
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-36 md:px-8 md:pb-32 md:pt-44">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-24 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-[120px] animate-float-orb" />
        <div className="absolute -right-32 bottom-8 h-[30rem] w-[30rem] rounded-full bg-teal/10 blur-[140px] animate-float-orb-delayed" />
        <div className="hero-grid absolute inset-0 opacity-40" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ ...transition, delay: 0.05 }} className="mb-7 flex items-center gap-3 text-[11px] font-medium tracking-[0.12em]" style={{ color: "var(--text-muted)" }}>
            <span className="h-2 w-2 rounded-full bg-teal shadow-[0_0_18px_rgba(0,212,170,0.9)]" />
            AI BUILD SYSTEM FOR ROBLOX STUDIO
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 18, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ ...transition, delay: 0.15 }} className="text-5xl font-semibold leading-[0.96] tracking-[-0.06em] sm:text-6xl md:text-[5.8rem]" style={{ color: "var(--text)" }}>
            The shortest path from <span className="text-accent">idea</span> to playable.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.3 }} className="mt-7 max-w-lg text-[17px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Describe a mechanic, a world, or a whole game loop. Vibe turns the brief into typed Luau, Studio changes, and visual direction you can keep shaping.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.42 }} className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/workspace" className="group inline-flex items-center gap-3 rounded-full px-5 py-3 text-[14px] font-semibold transition-transform hover:-translate-y-0.5" style={{ backgroundColor: "var(--text)", color: "var(--bg)" }}>
              Open the build room <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-white transition-transform group-hover:rotate-45">↗</span>
            </Link>
            <Link href="/assets" className="rounded-full border px-5 py-3 text-[14px] font-medium transition-colors hover:border-accent/50" style={{ borderColor: "var(--edge)", color: "var(--text-secondary)" }}>Browse visual references</Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...transition, delay: 0.65 }} className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[11px]" style={{ color: "var(--text-faint)" }}>
            <span>4 Roblox skill libraries</span><span>9 source datasets</span><span>Undoable Studio sync</span>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...transition, delay: 0.28, duration: 1 }} className="relative">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-accent/10 via-transparent to-teal/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] border" style={{ backgroundColor: "rgba(11,13,18,0.82)", borderColor: "var(--edge)", boxShadow: "0 30px 100px rgba(0,0,0,0.3)" }}>
            <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "var(--edge)" }}>
              <div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-[9px] bg-gradient-to-br from-accent to-teal text-sm text-white">✦</span><div><p className="text-[12px] font-semibold text-white">Vibe build room</p><p className="text-[10px] text-white/35">connected to Roblox Studio</p></div></div>
              <span className="flex items-center gap-2 text-[10px] text-teal"><span className="h-1.5 w-1.5 rounded-full bg-teal" /> LIVE</span>
            </div>
            <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
              <div className="border-b p-5 md:border-b-0 md:border-r" style={{ borderColor: "var(--edge)" }}>
                <p className="mb-3 text-[10px] font-medium tracking-[0.12em] text-white/30">BUILD BRIEF</p>
                <div className="rounded-xl border p-4 text-[13px] leading-relaxed text-white/70" style={{ borderColor: "rgba(124,92,252,0.28)", backgroundColor: "rgba(124,92,252,0.08)" }}>
                  Make a cozy tycoon with a glowing mushroom farm, upgrade paths, and a tiny night market.
                </div>
                <div className="mt-6 flex items-center gap-2 text-[11px] text-white/35"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> planning systems <span className="ml-auto text-white/20">02 / 04</span></div>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full w-2/3 rounded-full bg-gradient-to-r from-accent to-teal" /></div>
              </div>
              <div className="p-5">
                <div className="mb-4 flex items-center justify-between"><p className="text-[10px] font-medium tracking-[0.12em] text-white/30">SCENE MAP</p><span className="text-[10px] text-white/30">12 changes ready</span></div>
                <div className="space-y-2">
                  {sceneRows.map(([name, count, color]) => <div key={name} className="flex items-center gap-3 rounded-xl border px-3 py-3" style={{ borderColor: "rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.025)" }}><span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} /><span className="flex-1 text-[12px] text-white/70">{name}</span><span className="text-[10px] text-white/30">{count}</span></div>)}
                </div>
                <div className="mt-5 rounded-xl border border-teal/20 bg-teal/5 p-4"><div className="flex items-center gap-2 text-[11px] text-teal"><span>✓</span> Luau pass complete</div><p className="mt-2 text-[11px] leading-relaxed text-white/40">Server authority, typed modules, and save hooks are ready for review.</p></div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t px-5 py-3 text-[10px] text-white/30" style={{ borderColor: "var(--edge)" }}><span>Vibe AI · reasoning on</span><span>Undo available</span></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
