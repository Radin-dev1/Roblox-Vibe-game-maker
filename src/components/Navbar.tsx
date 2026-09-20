"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Assets", href: "/assets" },
  { label: "Workflow", href: "/workflow" },
  { label: "Plugin", href: "/plugin" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-5 px-4"
      >
        <div className="flex items-center gap-2 rounded-full bg-[var(--nav-bg)] backdrop-blur-2xl border border-[var(--edge)] px-2 py-2 shadow-[var(--shadow-ambient)] transition-theme">
          <Link href="/" className="flex items-center gap-2.5 pl-4 pr-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-teal flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                <line x1="12" y1="22" x2="12" y2="15.5" />
                <polyline points="22 8.5 12 15.5 2 8.5" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold tracking-tight" style={{ color: "var(--text)" }}>
              Vibe
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              link.href.startsWith("/") ? <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-[13px] rounded-full transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                style={{ color: "var(--text-secondary)" }}
              >
                {link.label}
              </Link> : <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-[13px] rounded-full transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                style={{ color: "var(--text-secondary)" }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2 pl-2">
            <ThemeToggle />
            <Link
              href="/studio"
              className="group relative flex items-center gap-2 rounded-full bg-[var(--bg-overlay)] hover:bg-[var(--bg-overlay-hover)] pl-5 pr-1.5 py-1.5 text-[13px] font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97]"
              style={{ color: "var(--text)" }}
            >
              <span>Open Studio</span>
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-accent to-teal transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--bg-overlay)] transition-colors duration-300"
              aria-label="Toggle menu"
            >
              <div className="relative w-4 h-3 flex flex-col justify-between">
                <motion.span
                  animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  className="block w-full h-[1.5px] origin-center"
                  style={{ backgroundColor: "var(--text-secondary)" }}
                />
                <motion.span
                  animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                  className="block w-full h-[1.5px]"
                  style={{ backgroundColor: "var(--text-secondary)" }}
                />
                <motion.span
                  animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  className="block w-full h-[1.5px] origin-center"
                  style={{ backgroundColor: "var(--text-secondary)" }}
                />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-30 backdrop-blur-3xl flex flex-col items-center justify-center gap-6"
            style={{ backgroundColor: "var(--modal-bg)" }}
          >
            {navLinks.map((link, i) => (
              link.href.startsWith("/") ? <motion.div
                key={link.label}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.32, 0.72, 0, 1],
                }}
                className="text-3xl font-semibold transition-colors duration-300"
                style={{ color: "var(--text-secondary)" }}
              ><Link href={link.href}>{link.label}</Link></motion.div> : <motion.a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.32, 0.72, 0, 1],
                }}
                className="text-3xl font-semibold transition-colors duration-300"
                style={{ color: "var(--text-secondary)" }}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
            >
              <Link
                href="/studio"
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-accent to-teal px-8 py-4 text-lg font-semibold text-white"
              >
                Open Studio
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
