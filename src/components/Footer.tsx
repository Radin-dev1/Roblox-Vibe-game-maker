"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative px-4 py-24 md:py-32 border-t" style={{ borderColor: "var(--edge)" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5" style={{ color: "var(--text)" }}>
            Ready to build?
          </h2>
          <p className="text-lg font-light mb-10" style={{ color: "var(--text-muted)" }}>
            Your next Roblox game is one prompt away.
          </p>
          <Link
            href="/studio"
            className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-accent to-teal pl-8 pr-2.5 py-3 text-[15px] font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_0_50px_rgba(124,92,252,0.3)] active:scale-[0.97]"
          >
            <span>Open Studio</span>
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </Link>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t" style={{ borderColor: "var(--edge)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent to-teal flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
              </svg>
            </div>
            <span className="text-[14px] font-semibold tracking-tight" style={{ color: "var(--text)" }}>Vibe</span>
          </div>
          <p className="text-[12px] font-light" style={{ color: "var(--text-faint)" }}>
            Built by Radin. Not affiliated with Roblox Corporation.
          </p>
        </div>
      </div>
    </footer>
  );
}
