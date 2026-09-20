"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { GAME_TEMPLATES, TEMPLATE_CATEGORIES, type GameTemplate } from "@/lib/templates";

const DIFFICULTY_COLORS = {
  beginner: { bg: "rgba(52,211,153,0.12)", text: "#34d399", border: "rgba(52,211,153,0.25)" },
  intermediate: { bg: "rgba(251,191,36,0.12)", text: "#fbbf24", border: "rgba(251,191,36,0.25)" },
  advanced: { bg: "rgba(255,107,107,0.12)", text: "#ff6b6b", border: "rgba(255,107,107,0.25)" },
};

function TemplateCard({ template, index }: { template: GameTemplate; index: number }) {
  const diff = DIFFICULTY_COLORS[template.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, delay: index * 0.04, ease: [0.32, 0.72, 0, 1] }}
    >
      <Link href={`/studio?template=${template.id}`} className="group block h-full">
        <div className="h-full rounded-[2rem] p-1.5 transition-theme border" style={{ backgroundColor: "var(--bg-overlay)", borderColor: "var(--edge)" }}>
          <div className="h-full rounded-[calc(2rem-0.375rem)] border overflow-hidden transition-theme" style={{ backgroundColor: "var(--card)", borderColor: "var(--edge)", boxShadow: "inset 0 1px 1px var(--inset)" }}>
            {/* Gradient placeholder thumbnail */}
            <div
              className="h-36 flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, ${diff.text}22, ${diff.text}08)` }}
            >
              <span className="text-5xl font-black tracking-tighter" style={{ color: `${diff.text}30` }}>
                {template.category.slice(0, 3).toUpperCase()}
              </span>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: diff.bg, color: diff.text, borderWidth: 1, borderColor: diff.border }}
                >
                  {template.difficulty}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--bg-overlay)", color: "var(--text-muted)", borderWidth: 1, borderColor: "var(--edge)" }}>
                  ~{template.estimatedTime}
                </span>
              </div>

              <h3 className="text-lg font-semibold tracking-tight mb-2" style={{ color: "var(--text)" }}>
                {template.title}
              </h3>
              <p className="text-[13px] font-light leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
                {template.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {template.features.slice(0, 3).map((feature) => (
                  <span key={feature} className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--bg-overlay)", color: "var(--text-secondary)", borderWidth: 1, borderColor: "var(--edge)" }}>
                    {feature}
                  </span>
                ))}
                {template.features.length > 3 && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--bg-overlay)", color: "var(--text-faint)" }}>
                    +{template.features.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-[13px] font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:gap-3 text-accent">
                <span>Use Template</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = GAME_TEMPLATES.filter((t) => {
    const matchCategory = activeCategory === "All" || t.category === activeCategory;
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.tags.some((tag) => tag.includes(search.toLowerCase()));
    return matchCategory && matchSearch;
  });

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
            <span className="text-[11px] uppercase tracking-[0.2em] font-medium" style={{ color: "var(--text-secondary)" }}>Templates</span>
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: "var(--text)" }}>
            Start with a Template
          </h1>
          <p className="text-[15px] font-light max-w-xl" style={{ color: "var(--text-muted)" }}>
            Pick a pre-built game template and customize it with AI. From obbies to simulators, get a head start on your next hit.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05, ease: [0.32, 0.72, 0, 1] }} className="mb-6">
          <div className="relative max-w-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-faint)" }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="w-full rounded-xl pl-11 pr-4 py-3 text-[14px] font-light outline-none transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus:ring-2 focus:ring-accent/30"
              style={{ backgroundColor: "var(--bg-overlay)", borderWidth: 1, borderColor: "var(--edge)", color: "var(--text)" }}
            />
          </div>
        </motion.div>

        {/* Category filters */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: [0.32, 0.72, 0, 1] }} className="flex flex-wrap gap-2 mb-10">
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97]"
              style={{
                backgroundColor: activeCategory === cat ? "rgba(124,92,252,0.15)" : "var(--bg-overlay)",
                borderWidth: 1,
                borderColor: activeCategory === cat ? "rgba(124,92,252,0.3)" : "var(--edge)",
                color: activeCategory === cat ? "#7c5cfc" : "var(--text-muted)",
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Templates grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((template, i) => (
            <TemplateCard key={template.id} template={template} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[15px] font-light" style={{ color: "var(--text-muted)" }}>No templates match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
