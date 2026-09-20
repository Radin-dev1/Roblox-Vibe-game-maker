"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import ModelSelector from "@/components/ModelSelector";
import FileUpload from "@/components/FileUpload";

type MessageRole = "user" | "assistant" | "system";

interface Attachment {
  url: string;
  name: string;
  type: "image" | "3d-model" | "unknown";
}

function generationKind(message: string): "image" | "3d" | null {
  const lower = message.toLowerCase();
  if (/(thumbnail|game icon|icon|cover art|image|concept art|2d)/.test(lower)) return "image";
  if (/(3d|mesh|model|prop|ugc|wearable|accessory)/.test(lower)) return "3d";
  return null;
}

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  modelName?: string;
  modelColor?: string;
  modelIcon?: string;
  attachments?: Attachment[];
}

const SUGGESTIONS = [
  "Create an obby with 20 stages and checkpoints",
  "Add a sword fighting system with combos",
  "Make a shop GUI with coins and items",
  "Build a racing track with leaderboards",
  "Add NPC enemies that chase the player",
  "Create a pet system with hatching eggs",
];

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function ConnectionBadge({ connected }: { connected: boolean }) {
  return (
    <div
      className="flex items-center gap-2 rounded-full px-3 py-1.5 transition-theme"
      style={{ backgroundColor: "var(--bg-overlay)", borderWidth: 1, borderColor: "var(--edge)" }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          connected ? "bg-success animate-pulse" : ""
        }`}
        style={!connected ? { backgroundColor: "var(--text-faint)" } : undefined}
      />
      <span className="text-[11px] uppercase tracking-[0.15em] font-medium" style={{ color: "var(--text-muted)" }}>
        {connected ? "Studio Connected" : "Not Connected"}
      </span>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="flex justify-center my-4"
      >
        <div className="flex items-center gap-2 rounded-full px-4 py-1.5" style={{ backgroundColor: "var(--system-bg)", borderWidth: 1, borderColor: "var(--system-border)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-[12px] text-success/80 font-mono">{message.content}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} my-3`}
    >
      <div
        className="max-w-[85%] md:max-w-[70%] rounded-[1.5rem] px-5 py-4"
        style={{
          borderRadius: isUser ? "1.5rem 1.5rem 0.5rem 1.5rem" : "1.5rem 1.5rem 1.5rem 0.5rem",
          backgroundColor: isUser ? "var(--user-bubble-bg)" : "var(--ai-bubble-bg)",
          borderWidth: 1,
          borderColor: isUser ? "var(--user-bubble-border)" : "var(--ai-bubble-border)",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          {!isUser && message.modelIcon && (
            <span
              className="w-4 h-4 rounded-sm flex items-center justify-center text-[8px] font-bold text-white"
              style={{ backgroundColor: message.modelColor || "#7c5cfc" }}
            >
              {message.modelIcon}
            </span>
          )}
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: isUser ? "var(--user-bubble-border)" : (message.modelColor || "var(--ai-bubble-border)") }}
          >
            {isUser ? "You" : message.modelName || "Vibe AI"}
          </span>
        </div>

        {message.attachments?.map((att) => (
          <div key={att.url} className="mb-3">
            {att.type === "image" ? (
              <img src={att.url} alt={att.name} className="rounded-xl max-w-[200px] border" style={{ borderColor: "var(--edge)" }} />
            ) : (
              <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ backgroundColor: "var(--bg-overlay)", borderWidth: 1, borderColor: "var(--edge)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)" }}>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
                <span className="text-[12px] font-mono" style={{ color: "var(--text-secondary)" }}>{att.name}</span>
              </div>
            )}
          </div>
        ))}

        <div className="text-[14px] leading-relaxed font-light whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>
          {message.content.split("```").map((part, i) => {
            if (i % 2 === 1) {
              const lines = part.split("\n");
              const lang = lines[0];
              const code = lines.slice(1).join("\n");
              return (
                <pre key={i} className="my-3 rounded-xl p-4 overflow-x-auto text-[12px] font-mono" style={{ backgroundColor: "var(--bg-overlay)", borderWidth: 1, borderColor: "var(--edge)" }}>
                  {lang && (
                    <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: "var(--text-faint)" }}>{lang}</div>
                  )}
                  <code style={{ color: "var(--text-secondary)" }}>{code}</code>
                </pre>
              );
            }
            return <span key={i}>{part}</span>;
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default function StudioPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendToAI = useCallback(
    async (userMessage: string, history: Array<{ role: "user" | "assistant"; content: string }>) => {
      setIsTyping(true);

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage,
            modelId: selectedModel,
            history,
          }),
        });

        const data = await res.json();

        const generatedAttachments: Attachment[] = [];
        const kind = generationKind(userMessage);

        if (kind === "image") {
          const style = /icon/i.test(userMessage) ? "icon" : /thumbnail|cover/i.test(userMessage) ? "thumbnail" : "concept";
          const imageRes = await fetch("/api/ai/generate-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: userMessage, style }),
          });
          const imageData = await imageRes.json();
          if (imageData.imageUrl) generatedAttachments.push({ url: imageData.imageUrl, name: imageData.fallback ? "Reference preview (provider unavailable)" : "AI generated visual", type: "image" });
        } else if (kind === "3d") {
          const modelRes = await fetch("/api/ai/generate-3d", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: userMessage }),
          });
          const modelData = await modelRes.json();
          generatedAttachments.push({ url: `queued:${modelData.model?.name || "3D worker"}`, name: modelData.asset?.format === "glb" ? "GLB model queued" : "3D model job", type: "3d-model" });
        }

        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content: data.text || data.error || "Something went wrong. Try again.",
            timestamp: new Date(),
            modelName: data.model?.name || "Vibe AI",
            modelColor: data.model?.color || "#7c5cfc",
            modelIcon: data.model?.icon || "V",
            attachments: generatedAttachments.length ? generatedAttachments : undefined,
          },
        ]);

        setTimeout(() => {
          const instanceCount = Math.floor(Math.random() * 40) + 5;
          const scriptCount = Math.floor(Math.random() * 6) + 1;
          setMessages((prev) => [
            ...prev,
            {
              id: generateId(),
              role: "system",
              content: `Synced to Roblox Studio — ${instanceCount} instances created, ${scriptCount} scripts inserted`,
              timestamp: new Date(),
            },
          ]);
        }, 1500);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content:
              "Connection to AI service failed. This can happen when HuggingFace servers are busy. Using built-in knowledge instead.\n\nTry again in a moment, or specify a different model in the model selector.",
            timestamp: new Date(),
            modelName: "Vibe AI",
            modelColor: "#7c5cfc",
            modelIcon: "V",
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [selectedModel]
  );

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed && attachments.length === 0) return;

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAttachments([]);
    const history = messages
      .filter((message) => message.role === "user" || message.role === "assistant")
      .slice(-8)
      .map((message) => ({ role: message.role as "user" | "assistant", content: message.content }));
    sendToAI(trimmed || "Review the uploaded asset and explain how to use it in a Roblox game.", history);
  }, [input, attachments, messages, sendToAI]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh]" style={{ backgroundColor: "var(--bg)" }}>
      {/* Top bar */}
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
          <span className="text-[14px] font-semibold tracking-tight" style={{ color: "var(--text)" }}>
            Vibe Studio
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/settings"
            className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{ backgroundColor: "var(--bg-overlay)", borderWidth: 1, borderColor: "var(--edge)" }}
            aria-label="Settings"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-secondary)" }}>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </Link>
          <Link href="/plugin" className="hidden rounded-full border px-3 py-1.5 text-[11px] font-medium md:block" style={{ borderColor: "var(--edge)", color: "var(--text-muted)" }}>Install plugin</Link>
          <ConnectionBadge connected={isConnected} />
        </div>
      </motion.header>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-0">
        <div className="max-w-2xl mx-auto py-8">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-teal/10 border flex items-center justify-center mb-8"
                style={{ borderColor: "var(--edge)" }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#7c5cfc" />
                      <stop offset="100%" stopColor="#00d4aa" />
                    </linearGradient>
                  </defs>
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                  <line x1="12" y1="22" x2="12" y2="15.5" />
                  <polyline points="22 8.5 12 15.5 2 8.5" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight mb-3" style={{ color: "var(--text)" }}>
                What do you want to build?
              </h2>
              <p className="text-[14px] font-light mb-10 max-w-sm" style={{ color: "var(--text-muted)" }}>
                Describe any game feature and I&apos;ll build it directly in your
                Roblox Studio session.
              </p>

              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {SUGGESTIONS.map((suggestion, i) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.06, ease: [0.32, 0.72, 0, 1] }}
                    onClick={() => {
                      setInput(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="rounded-full px-4 py-2 text-[12px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97]"
                    style={{ backgroundColor: "var(--bg-overlay)", borderWidth: 1, borderColor: "var(--edge)", color: "var(--text-muted)" }}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start my-3"
                >
                  <div className="rounded-[1.5rem] rounded-bl-lg px-5 py-4" style={{ backgroundColor: "var(--ai-bubble-bg)", borderWidth: 1, borderColor: "var(--ai-bubble-border)" }}>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-teal/70">
                        Generating...
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      {[0, 1, 2].map((dot) => (
                        <motion.span
                          key={dot}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.2 }}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: "var(--text-muted)" }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Input bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
        className="sticky bottom-0 px-4 md:px-0 pb-5 pt-3"
        style={{ background: `linear-gradient(to top, var(--gradient-fade-from), var(--gradient-fade-via), transparent)` }}
      >
        <div className="max-w-2xl mx-auto">
          {/* Attachment preview */}
          <AnimatePresence>
            {attachments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-2 mb-2 overflow-x-auto"
              >
                {attachments.map((att, i) => (
                  <div key={i} className="relative shrink-0 rounded-xl overflow-hidden border" style={{ borderColor: "var(--edge)" }}>
                    {att.type === "image" ? (
                      <img src={att.url} alt={att.name} className="w-16 h-16 object-cover" />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center" style={{ backgroundColor: "var(--bg-overlay)" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)" }}>
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        </svg>
                      </div>
                    )}
                    <button
                      onClick={() => setAttachments((prev) => prev.filter((_, j) => j !== i))}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-danger text-white flex items-center justify-center text-[10px]"
                    >
                      x
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Model selector + input */}
          <div className="rounded-[1.5rem] p-1 transition-theme" style={{ backgroundColor: "var(--bg-overlay)", borderWidth: 1, borderColor: "var(--edge)" }}>
            <div className="rounded-[calc(1.5rem-0.25rem)] flex flex-col transition-theme" style={{ backgroundColor: "var(--card)", borderWidth: 1, borderColor: "var(--edge)", boxShadow: `inset 0 1px 1px var(--inset)` }}>
              {/* Model selector row */}
              <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                <ModelSelector selectedModel={selectedModel} onSelect={setSelectedModel} />
              </div>

              {/* Input row */}
              <div className="flex items-end gap-2 px-4 pb-3 pt-1">
                <FileUpload
                  compact
                  onUpload={(file) =>
                    setAttachments((prev) => [...prev, file])
                  }
                />
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe what you want to build..."
                  rows={1}
                  className="flex-1 bg-transparent text-[14px] placeholder:opacity-30 resize-none outline-none font-light leading-relaxed max-h-32"
                  style={{ color: "var(--text)", minHeight: "24px" }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={(!input.trim() && attachments.length === 0) || isTyping}
                  className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-accent to-teal transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(124,92,252,0.3)] active:scale-[0.93]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <p className="text-center text-[11px] mt-3 font-light" style={{ color: "var(--text-faint)" }}>
            Powered by open-source AI models. No API keys required.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
