"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const INSTALL_STEPS = [
  {
    step: "01",
    title: "Download the Plugin",
    description: "Click the download button below to get the VibeStudioPlugin.lua file.",
  },
  {
    step: "02",
    title: "Open Roblox Studio",
    description: "Open Roblox Studio. Go to the Plugins tab and click \"Plugins Folder\" to open it.",
  },
  {
    step: "03",
    title: "Install the Plugin",
    description: "Drag the .lua file into the plugins folder. Restart Studio — \"Vibe Studio\" appears in the toolbar.",
  },
  {
    step: "04",
    title: "Enable HTTP Requests",
    description: "In Studio, go to Game Settings → Security → Allow HTTP Requests and enable it. This lets the plugin talk to the web app.",
  },
  {
    step: "05",
    title: "Connect",
    description: "Click \"Connect\" in the Vibe Studio toolbar. The status dot turns green when connected. Start building!",
  },
];

const PLUGIN_FEATURES = [
  { title: "Live Sync", description: "Every AI change instantly appears in your Studio scene", icon: "⚡" },
  { title: "Undo Support", description: "Full ChangeHistory integration — Ctrl+Z anything the AI does", icon: "↩" },
  { title: "Scene Reader", description: "AI reads your existing scene to make context-aware edits", icon: "👁" },
  { title: "Script Injection", description: "Server, Client, and Module scripts placed correctly", icon: "📜" },
  { title: "Bulk Operations", description: "Create hundreds of instances in a single sync", icon: "📦" },
  { title: "Error Logging", description: "Built-in log panel shows every change the AI makes", icon: "📋" },
];

export default function PluginPage() {
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/plugin/VibeStudioPlugin.lua";
    link.download = "VibeStudioPlugin.lua";
    link.click();
  };

  const handleCopyInstallCmd = () => {
    navigator.clipboard.writeText(`${window.location.origin}/plugin/VibeStudioPlugin.lua`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6" style={{ backgroundColor: "var(--tag-bg)", borderWidth: 1, borderColor: "var(--tag-border)" }}>
            <span className="text-[11px] uppercase tracking-[0.2em] font-medium" style={{ color: "var(--text-secondary)" }}>Plugin</span>
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4" style={{ color: "var(--text)" }}>
            Roblox Studio Plugin
          </h1>
          <p className="text-lg font-light max-w-xl mx-auto mb-10" style={{ color: "var(--text-muted)" }}>
            The bridge between AI and your game. Install the plugin and every AI generation syncs directly into Roblox Studio.
          </p>

          <div className="mx-auto mb-8 max-w-xl rounded-2xl border p-4 text-left" style={{ backgroundColor: "var(--bg-overlay)", borderColor: "var(--edge)" }}>
            <p className="text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>Local connection</p>
            <p className="mt-1 text-[12px] leading-relaxed" style={{ color: "var(--text-muted)" }}>The included plugin talks to the Vibe app running on the same computer at <code className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-[11px]">http://localhost:3000</code>. Start the app locally before clicking Connect in Studio.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleDownload}
              className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-accent to-teal pl-7 pr-2.5 py-3 text-[15px] font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_0_40px_rgba(124,92,252,0.3)] active:scale-[0.97]"
            >
              <span>Download Plugin</span>
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </span>
            </button>

            <button
              onClick={handleCopyInstallCmd}
              className="flex items-center gap-2 rounded-full border px-5 py-3 text-[13px] font-mono transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97]"
              style={{ borderColor: "var(--edge)", color: "var(--text-secondary)" }}
            >
              <span>{copied ? "Copied!" : "Copy Download Link"}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Plugin features */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.32, 0.72, 0, 1] }} className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLUGIN_FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.05, ease: [0.32, 0.72, 0, 1] }}
              >
                <div className="rounded-[2rem] p-1.5 transition-theme border" style={{ backgroundColor: "var(--bg-overlay)", borderColor: "var(--edge)" }}>
                  <div className="rounded-[calc(2rem-0.375rem)] border p-6 transition-theme" style={{ backgroundColor: "var(--card)", borderColor: "var(--edge)", boxShadow: "inset 0 1px 1px var(--inset)" }}>
                    <div className="text-2xl mb-3">{feature.icon}</div>
                    <h3 className="text-[15px] font-semibold tracking-tight mb-1" style={{ color: "var(--text)" }}>{feature.title}</h3>
                    <p className="text-[12px] font-light" style={{ color: "var(--text-muted)" }}>{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Installation steps */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}>
          <h2 className="text-2xl font-bold tracking-tight mb-8 text-center" style={{ color: "var(--text)" }}>
            Installation Guide
          </h2>
          <div className="space-y-4">
            {INSTALL_STEPS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: [0.32, 0.72, 0, 1] }}
              >
                <div className="rounded-[2rem] p-1.5 transition-theme border" style={{ backgroundColor: "var(--bg-overlay)", borderColor: "var(--edge)" }}>
                  <div className="rounded-[calc(2rem-0.375rem)] border p-6 md:p-8 flex items-start gap-6 transition-theme" style={{ backgroundColor: "var(--card)", borderColor: "var(--edge)", boxShadow: "inset 0 1px 1px var(--inset)" }}>
                    <span className="text-[32px] font-bold tracking-tighter shrink-0" style={{ color: "var(--number-color)" }}>
                      {item.step}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight mb-2" style={{ color: "var(--text)" }}>{item.title}</h3>
                      <p className="text-[14px] font-light leading-relaxed" style={{ color: "var(--text-muted)" }}>{item.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Source code preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className="mt-16"
        >
          <div className="rounded-[2rem] p-1.5 transition-theme border" style={{ backgroundColor: "var(--bg-overlay)", borderColor: "var(--edge)" }}>
            <div className="rounded-[calc(2rem-0.375rem)] border overflow-hidden transition-theme" style={{ backgroundColor: "var(--card)", borderColor: "var(--edge)", boxShadow: "inset 0 1px 1px var(--inset)" }}>
              <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--edge)" }}>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--window-dot)" }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--window-dot)" }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--window-dot)" }} />
                  </div>
                  <span className="text-[11px] font-mono ml-2" style={{ color: "var(--text-faint)" }}>VibeStudioPlugin.lua</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-accent/10 text-accent">
                  Luau
                </span>
              </div>
              <pre className="p-5 overflow-x-auto text-[12px] font-mono leading-relaxed max-h-64" style={{ color: "var(--text-secondary)" }}>
{`-- Vibe Studio Plugin for Roblox Studio
-- Connects your session to the Vibe AI web app

local HttpService = game:GetService("HttpService")
local ChangeHistoryService = game:GetService("ChangeHistoryService")

local PLUGIN_VERSION = "1.0.0"
local toolbar = plugin:CreateToolbar("Vibe Studio")
local connectButton = toolbar:CreateButton("Connect", ...)

-- Full source available in the download
-- Handles: instance creation, script injection,
-- lighting, bulk operations, and undo support`}
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
