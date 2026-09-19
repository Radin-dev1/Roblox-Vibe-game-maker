"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AI_MODELS, type AIModel } from "@/lib/models";

interface ModelSelectorProps {
  selectedModel: string | null;
  onSelect: (modelId: string | null) => void;
  category?: "text" | "image-2d" | "image-3d" | "all";
}

export default function ModelSelector({
  selectedModel,
  onSelect,
  category = "all",
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const models =
    category === "all"
      ? AI_MODELS
      : AI_MODELS.filter((m) => m.category === category);

  const selected = selectedModel
    ? models.find((m) => m.id === selectedModel)
    : null;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full bg-[var(--bg-overlay)] border border-[var(--edge)] hover:border-[var(--edge-hover)] px-3 py-1.5 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97]"
      >
        {selected ? (
          <>
            <span
              className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
              style={{ backgroundColor: selected.color }}
            >
              {selected.icon}
            </span>
            <span className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>
              {selected.name}
            </span>
          </>
        ) : (
          <>
            <span className="w-5 h-5 rounded-md bg-gradient-to-br from-accent to-teal flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
              </svg>
            </span>
            <span className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>
              Auto
            </span>
          </>
        )}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          style={{ color: "var(--text-faint)" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="absolute bottom-full left-0 mb-2 w-72 rounded-2xl bg-[var(--card)] border border-[var(--edge)] shadow-[var(--shadow-ambient)] overflow-hidden z-50 backdrop-blur-2xl"
          >
            <div className="p-2">
              {/* Auto option */}
              <button
                onClick={() => {
                  onSelect(null);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 ${
                  !selectedModel
                    ? "bg-accent/10 border border-accent/20"
                    : "hover:bg-[var(--bg-overlay)] border border-transparent"
                }`}
              >
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-teal flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                  </svg>
                </span>
                <div className="text-left">
                  <p className="text-[13px] font-medium" style={{ color: "var(--text)" }}>
                    Auto
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    Best model for the task
                  </p>
                </div>
              </button>

              <div className="h-px bg-[var(--edge)] my-1.5" />

              {/* Model list */}
              {models.map((model: AIModel) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onSelect(model.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 ${
                    selectedModel === model.id
                      ? "bg-accent/10 border border-accent/20"
                      : "hover:bg-[var(--bg-overlay)] border border-transparent"
                  }`}
                >
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-bold text-white shrink-0"
                    style={{ backgroundColor: model.color }}
                  >
                    {model.icon}
                  </span>
                  <div className="text-left flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-medium truncate" style={{ color: "var(--text)" }}>
                        {model.name}
                      </p>
                      {model.requiresToken && (
                        <span className="shrink-0 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-warning/10 text-warning font-semibold">
                          Token
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>
                      {model.provider} · {model.category}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
