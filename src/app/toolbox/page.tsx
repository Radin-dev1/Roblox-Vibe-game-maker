"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { TOOLS, TOOL_CATEGORIES, type Tool } from "@/lib/tools";

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, delay: index * 0.04, ease: [0.32, 0.72, 0, 1] }}
    >
      <Link
        href={tool.comingSoon ? "#" : `/studio?tool=${tool.id}`}
        className={`group block h-full ${tool.comingSoon ? "opacity-60 cursor-default" : ""}`}
      >
        <div className="h-full rounded-[2rem] p-1.5 transition-theme border" style={{ backgroundColor: "var(--bg-overlay)", borderColor: "var(--edge)" }}>
          <div className="h-full rounded-[calc(2rem-0.375rem)] border p-6 md:p-8 transition-theme" style={{ backgroundColor: "var(--card)", borderColor: "var(--edge)", boxShadow: "inset 0 1px 1px var(--inset)" }}>
            <div className="flex items-start justify-between mb-5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-[18px] font-bold text-white transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110"
                style={{ backgroundColor: tool.color }}
              >
                {tool.icon}
              </div>
              {tool.comingSoon && (
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: "var(--bg-overlay)", color: "var(--text-muted)", borderWidth: 1, borderColor: "var(--edge)" }}>
                  Coming Soon
                </span>
              )}
            </div>

            <h3 className="text-lg font-semibold tracking-tight mb-2" style={{ color: "var(--text)" }}>
              {tool.name}
            </h3>
            <p className="text-[13px] font-light leading-relaxed mb-5" style={{ color: "var(--text-muted)" }}>
              {tool.description}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {tool.features.map((feature) => (
                <span
                  key={feature}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${tool.color}15`, color: tool.color, borderWidth: 1, borderColor: `${tool.color}25` }}
                >
                  {feature}
                </span>
              ))}
            </div>

            {!tool.comingSoon && (
              <div className="mt-6 flex items-center gap-2 text-[13px] font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:gap-3" style={{ color: tool.color }}>
                <span>Open Tool</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ToolboxPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTools = activeCategory === "all"
    ? TOOLS
    : TOOLS.filter((t) => t.category === activeCategory);

  return (
    <div className="min-h-[100dvh]" style={{ backgroundColor: "var(--bg)" }}>
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="flex items-center justify-between px-4 md:px-6 py-3 border-b transition-theme"
        style={{ borderColor: "var(--edge)" }}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-teal flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            </svg>
          </div>
          <span className="text-[14px] font-semibold tracking-tight" style={{ color: "var(--text)" }}>Vibe Studio</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/studio" className="flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" style={{ backgroundColor: "var(--bg-overlay)", borderWidth: 1, borderColor: "var(--edge)", color: "var(--text-secondary)" }}>
            Open Studio
          </Link>
        </div>
      </motion.header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }} className="mb-10">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4" style={{ backgroundColor: "var(--tag-bg)", borderWidth: 1, borderColor: "var(--tag-border)" }}>
            <span className="text-[11px] uppercase tracking-[0.2em] font-medium" style={{ color: "var(--text-secondary)" }}>Toolbox</span>
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: "var(--text)" }}>
            AI Tools for Every Task
          </h1>
          <p className="text-[15px] font-light max-w-xl" style={{ color: "var(--text-muted)" }}>
            From scripts to 3D maps, GUI layouts to game systems — pick the right tool and let AI do the heavy lifting.
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {TOOL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97]"
              style={{
                backgroundColor: activeCategory === cat.id ? "rgba(124,92,252,0.15)" : "var(--bg-overlay)",
                borderWidth: 1,
                borderColor: activeCategory === cat.id ? "rgba(124,92,252,0.3)" : "var(--edge)",
                color: activeCategory === cat.id ? "#7c5cfc" : "var(--text-muted)",
              }}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Tools grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
