"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AI_MODELS, KNOWLEDGE_SOURCES } from "@/lib/models";

export default function SettingsPage() {
  const [hfToken, setHfToken] = useState("");
  const [defaultModel, setDefaultModel] = useState("auto");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const t = localStorage.getItem("vibe-hf-token");
      if (t) setHfToken(t);
      const m = localStorage.getItem("vibe-default-model");
      if (m) setDefaultModel(m);
    } catch {}
  }, []);

  const handleSave = () => {
    try {
      if (hfToken) {
        localStorage.setItem("vibe-hf-token", hfToken);
      } else {
        localStorage.removeItem("vibe-hf-token");
      }
      localStorage.setItem("vibe-default-model", defaultModel);
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-[100dvh]" style={{ backgroundColor: "var(--bg)" }}>
      {/* Header */}
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="flex items-center justify-between px-4 md:px-6 py-3 border-b transition-theme"
        style={{ borderColor: "var(--edge)" }}
      >
        <Link href="/studio" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-teal flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            </svg>
          </div>
          <span className="text-[14px] font-semibold tracking-tight" style={{ color: "var(--text)" }}>
            Vibe Studio
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/studio"
            className="flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{ backgroundColor: "var(--bg-overlay)", borderWidth: 1, borderColor: "var(--edge)", color: "var(--text-secondary)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Studio
          </Link>
        </div>
      </motion.header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
          <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: "var(--text)" }}>Settings</h1>
          <p className="text-[14px] font-light mb-10" style={{ color: "var(--text-muted)" }}>Configure AI models, tokens, and preferences.</p>
        </motion.div>

        {/* Theme section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.32, 0.72, 0, 1] }}
          className="mb-8"
        >
          <div className="rounded-[2rem] p-1.5 transition-theme" style={{ backgroundColor: "var(--bg-overlay)", borderWidth: 1, borderColor: "var(--edge)" }}>
            <div className="rounded-[calc(2rem-0.375rem)] p-6 md:p-8 transition-theme" style={{ backgroundColor: "var(--card)", borderWidth: 1, borderColor: "var(--edge)", boxShadow: "inset 0 1px 1px var(--inset)" }}>
              <h2 className="text-lg font-semibold mb-1 tracking-tight" style={{ color: "var(--text)" }}>Appearance</h2>
              <p className="text-[13px] font-light mb-5" style={{ color: "var(--text-muted)" }}>Vibe uses a light, cream workspace so your game tools stay easy to read.</p>
              <span className="inline-flex rounded-full border px-3 py-1.5 text-[12px] font-medium" style={{ color: "var(--text-secondary)", borderColor: "var(--edge)", backgroundColor: "var(--bg-overlay)" }}>Light workspace</span>
            </div>
          </div>
        </motion.section>

        {/* HF Token */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
          className="mb-8"
        >
          <div className="rounded-[2rem] p-1.5 transition-theme" style={{ backgroundColor: "var(--bg-overlay)", borderWidth: 1, borderColor: "var(--edge)" }}>
            <div className="rounded-[calc(2rem-0.375rem)] p-6 md:p-8 transition-theme" style={{ backgroundColor: "var(--card)", borderWidth: 1, borderColor: "var(--edge)", boxShadow: "inset 0 1px 1px var(--inset)" }}>
              <h2 className="text-lg font-semibold mb-1 tracking-tight" style={{ color: "var(--text)" }}>HuggingFace Token</h2>
              <p className="text-[13px] font-light mb-5" style={{ color: "var(--text-muted)" }}>Optional. Adds access to gated models and higher rate limits. Works without a token using free tier.</p>
              <input
                type="password"
                value={hfToken}
                onChange={(e) => setHfToken(e.target.value)}
                placeholder="hf_xxxxxxxxxxxxxxxxxxxx"
                className="w-full rounded-xl px-4 py-3 text-[14px] font-mono outline-none transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus:ring-2 focus:ring-accent/30"
                style={{ backgroundColor: "var(--bg-overlay)", borderWidth: 1, borderColor: "var(--edge)", color: "var(--text)" }}
              />
            </div>
          </div>
        </motion.section>

        {/* Default Model */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
          className="mb-8"
        >
          <div className="rounded-[2rem] p-1.5 transition-theme" style={{ backgroundColor: "var(--bg-overlay)", borderWidth: 1, borderColor: "var(--edge)" }}>
            <div className="rounded-[calc(2rem-0.375rem)] p-6 md:p-8 transition-theme" style={{ backgroundColor: "var(--card)", borderWidth: 1, borderColor: "var(--edge)", boxShadow: "inset 0 1px 1px var(--inset)" }}>
              <h2 className="text-lg font-semibold mb-1 tracking-tight" style={{ color: "var(--text)" }}>Default AI Model</h2>
              <p className="text-[13px] font-light mb-5" style={{ color: "var(--text-muted)" }}>Choose which model to use by default. Auto selects the best model for each task.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => setDefaultModel("auto")}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  style={{
                    backgroundColor: defaultModel === "auto" ? "rgba(124,92,252,0.12)" : "var(--bg-overlay)",
                    borderWidth: 1,
                    borderColor: defaultModel === "auto" ? "rgba(124,92,252,0.3)" : "var(--edge)",
                  }}
                >
                  <span className="w-6 h-6 rounded-md bg-gradient-to-br from-accent to-teal flex items-center justify-center text-[9px] font-bold text-white">A</span>
                  <div>
                    <div className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>Auto</div>
                    <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>Best model for each task</div>
                  </div>
                </button>
                {AI_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setDefaultModel(model.id)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    style={{
                      backgroundColor: defaultModel === model.id ? `${model.color}18` : "var(--bg-overlay)",
                      borderWidth: 1,
                      borderColor: defaultModel === model.id ? `${model.color}50` : "var(--edge)",
                    }}
                  >
                    <span className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: model.color }}>{model.icon}</span>
                    <div>
                      <div className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{model.name}</div>
                      <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{model.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Knowledge Sources */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
          className="mb-8"
        >
          <div className="rounded-[2rem] p-1.5 transition-theme" style={{ backgroundColor: "var(--bg-overlay)", borderWidth: 1, borderColor: "var(--edge)" }}>
            <div className="rounded-[calc(2rem-0.375rem)] p-6 md:p-8 transition-theme" style={{ backgroundColor: "var(--card)", borderWidth: 1, borderColor: "var(--edge)", boxShadow: "inset 0 1px 1px var(--inset)" }}>
              <h2 className="text-lg font-semibold mb-1 tracking-tight" style={{ color: "var(--text)" }}>Knowledge Sources</h2>
              <p className="text-[13px] font-light mb-5" style={{ color: "var(--text-muted)" }}>The AI is trained using these open-source datasets and repositories for Roblox game development.</p>
              <div className="space-y-2">
                {KNOWLEDGE_SOURCES.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    style={{ backgroundColor: "var(--bg-overlay)", borderWidth: 1, borderColor: "var(--edge)" }}
                  >
                    <span
                      className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ backgroundColor: source.type === "github" ? "#333" : "#ff9d00" }}
                    >
                      {source.type === "github" ? "G" : "H"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold truncate" style={{ color: "var(--text)" }}>{source.name}</div>
                      <div className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>{source.description}</div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" style={{ color: "var(--text-faint)" }}>
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Save button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.32, 0.72, 0, 1] }}
          className="flex justify-end"
        >
          <button
            onClick={handleSave}
            className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-accent to-teal pl-6 pr-2.5 py-3 text-[14px] font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_0_30px_rgba(124,92,252,0.3)] active:scale-[0.97]"
          >
            <span>{saved ? "Saved!" : "Save Settings"}</span>
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105">
              {saved ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
              )}
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
