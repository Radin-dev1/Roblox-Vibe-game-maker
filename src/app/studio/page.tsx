"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type MessageRole = "user" | "assistant" | "system";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
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
    <div className="flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/[0.06] px-3 py-1.5">
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          connected ? "bg-[#34d399] animate-pulse" : "bg-white/20"
        }`}
      />
      <span className="text-[11px] uppercase tracking-[0.15em] font-medium text-white/40">
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
        <div className="flex items-center gap-2 rounded-full bg-[#34d399]/10 border border-[#34d399]/20 px-4 py-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-[12px] text-[#34d399]/80 font-mono">
            {message.content}
          </span>
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
        className={`max-w-[85%] md:max-w-[70%] ${
          isUser
            ? "rounded-[1.5rem] rounded-br-lg bg-[#7c5cfc]/15 border border-[#7c5cfc]/20"
            : "rounded-[1.5rem] rounded-bl-lg bg-white/[0.04] border border-white/[0.06]"
        } px-5 py-4`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${
              isUser ? "text-[#7c5cfc]/70" : "text-[#00d4aa]/70"
            }`}
          >
            {isUser ? "You" : "Vibe AI"}
          </span>
        </div>
        <p className="text-[14px] text-white/70 leading-relaxed font-light whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
    </motion.div>
  );
}

export default function StudioPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsConnected(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const simulateResponse = useCallback((userMessage: string) => {
    setIsTyping(true);

    const responses: Record<string, { reply: string; system: string }> = {
      obby: {
        reply: "I'll create a 20-stage obby for you. Setting up the stage parts with increasing difficulty, adding checkpoint spawn locations at each stage, and creating a stage tracker UI...\n\nHere's what I'm building:\n- 20 stages with varied obstacles (jumps, moving platforms, spinners, lava sections)\n- Checkpoint system that saves progress\n- Stage counter GUI in the top-right\n- Kill bricks that reset to last checkpoint\n- A victory celebration at stage 20",
        system: "Synced to Roblox Studio — 47 instances created, 3 scripts inserted",
      },
      sword: {
        reply: "Building a combat system now. I'm creating a Tool called \"Sword\" with full animation support...\n\nHere's the plan:\n- Sword Tool with slash animation and hitbox\n- 3-hit combo chain (light → heavy → uppercut)\n- Damage falloff based on combo timing\n- Special attack meter that fills on successful hits\n- Ultimate ability: spinning AoE slash on full meter\n- Damage numbers that float above enemies",
        system: "Synced to Roblox Studio — 12 instances created, 5 scripts inserted",
      },
      shop: {
        reply: "Creating a full shop system with economy. I'll set up the GUI, data saving, and item management...\n\nBuilding:\n- Shop GUI with categories (Weapons, Armor, Pets, Consumables)\n- Coin currency with DataStore saving\n- Item thumbnails and descriptions\n- Buy/equip/unequip flow\n- Coin display in the HUD\n- Starting coins: 100",
        system: "Synced to Roblox Studio — 28 instances created, 4 scripts inserted",
      },
      racing: {
        reply: "Setting up a racing track with competitive features...\n\nCreating:\n- Oval track with 8 checkpoints\n- Vehicle spawn pad with a basic kart\n- Lap timer and checkpoint validation\n- Global leaderboard (DataStore-backed)\n- Starting countdown (3... 2... 1... GO!)\n- Finish line with confetti particles",
        system: "Synced to Roblox Studio — 35 instances created, 6 scripts inserted",
      },
      npc: {
        reply: "I'll add enemy NPCs with pathfinding AI...\n\nHere's the setup:\n- Zombie NPC model with basic humanoid\n- PathfindingService-based chase behavior\n- Detection range: 40 studs, chase range: 60 studs\n- Attack on touch: 20 damage, 1s cooldown\n- Respawn after death: 10 seconds\n- Spawning 5 zombies around the map",
        system: "Synced to Roblox Studio — 18 instances created, 2 scripts inserted",
      },
      pet: {
        reply: "Creating a complete pet system with egg hatching...\n\nBuilding:\n- 3 egg types (Common, Rare, Legendary) with different pet pools\n- Egg hatching animation with camera zoom\n- Pet following system with smooth movement\n- Pet inventory GUI with equip/unequip\n- Rarity display with glow effects\n- DataStore saving for pet collection",
        system: "Synced to Roblox Studio — 42 instances created, 7 scripts inserted",
      },
    };

    const lowerMsg = userMessage.toLowerCase();
    let matchedResponse = {
      reply: `I'll work on that now. Analyzing your current Studio scene and generating the necessary instances and scripts...\n\nProcessing: "${userMessage}"\n\nI'm creating the parts, scripts, and UI elements needed. Give me a moment to sync everything to your Studio session.`,
      system: `Synced to Roblox Studio — ${Math.floor(Math.random() * 30) + 10} instances created`,
    };

    for (const [key, value] of Object.entries(responses)) {
      if (lowerMsg.includes(key)) {
        matchedResponse = value;
        break;
      }
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "assistant",
          content: matchedResponse.reply,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "system",
            content: matchedResponse.system,
            timestamp: new Date(),
          },
        ]);
      }, 1500);
    }, 2000 + Math.random() * 1500);
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    simulateResponse(trimmed);
  }, [input, simulateResponse]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#050505]">
      {/* Top bar */}
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/[0.04]"
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7c5cfc] to-[#00d4aa] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            </svg>
          </div>
          <span className="text-[14px] font-semibold tracking-tight">
            Vibe Studio
          </span>
        </Link>

        <ConnectionBadge connected={isConnected} />
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7c5cfc]/20 to-[#00d4aa]/10 border border-white/[0.06] flex items-center justify-center mb-8">
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
              <h2 className="text-2xl font-semibold tracking-tight mb-3">
                What do you want to build?
              </h2>
              <p className="text-[14px] text-white/30 font-light mb-10 max-w-sm">
                Describe any game feature and I&apos;ll build it directly in your
                Roblox Studio session.
              </p>

              {/* Suggestion pills */}
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {SUGGESTIONS.map((suggestion, i) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.3 + i * 0.06,
                      ease: [0.32, 0.72, 0, 1],
                    }}
                    onClick={() => {
                      setInput(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="rounded-full bg-white/[0.04] border border-white/[0.06] px-4 py-2 text-[12px] text-white/40 hover:text-white/70 hover:bg-white/[0.07] hover:border-white/[0.1] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97]"
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
                  <div className="rounded-[1.5rem] rounded-bl-lg bg-white/[0.04] border border-white/[0.06] px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#00d4aa]/70">
                        Vibe AI
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      {[0, 1, 2].map((dot) => (
                        <motion.span
                          key={dot}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: dot * 0.2,
                          }}
                          className="w-1.5 h-1.5 rounded-full bg-white/30"
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
        className="sticky bottom-0 px-4 md:px-0 pb-5 pt-3 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent"
      >
        <div className="max-w-2xl mx-auto">
          {/* Double-bezel input */}
          <div className="rounded-[1.5rem] bg-white/[0.03] border border-white/[0.06] p-1">
            <div className="rounded-[calc(1.5rem-0.25rem)] bg-[#0a0a0a] border border-white/[0.04] shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] flex items-end gap-2 px-4 py-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe what you want to build..."
                rows={1}
                className="flex-1 bg-transparent text-[14px] text-white/80 placeholder:text-white/20 resize-none outline-none font-light leading-relaxed max-h-32"
                style={{
                  height: "auto",
                  minHeight: "24px",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#7c5cfc] to-[#00d4aa] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(124,92,252,0.3)] active:scale-[0.93]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-center text-[11px] text-white/15 mt-3 font-light">
            Vibe connects to Roblox Studio via plugin. Make sure the plugin is
            installed and Studio is open.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
