"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type NodeKind = "prompt" | "model" | "image" | "code" | "output";
type FlowNode = { id: string; kind: NodeKind; title: string; subtitle: string; x: number; y: number; color: string; icon: string };

const INITIAL_NODES: FlowNode[] = [
  { id: "prompt", kind: "prompt", title: "Game brief", subtitle: "Describe your Roblox idea", x: 70, y: 160, color: "#7c5cfc", icon: "✦" },
  { id: "model", kind: "model", title: "Gemma 4 E4B", subtitle: "Luau + planning", x: 370, y: 160, color: "#4285f4", icon: "G" },
  { id: "image", kind: "image", title: "SDXL thumbnails", subtitle: "Hugging Face · image", x: 680, y: 65, color: "#ff6b6b", icon: "F" },
  { id: "code", kind: "code", title: "Luau system", subtitle: "Roblox server script", x: 680, y: 265, color: "#00d4aa", icon: "</>" },
  { id: "output", kind: "output", title: "Build results", subtitle: "Review before Studio", x: 990, y: 160, color: "#fbbf24", icon: "↗" },
];

const NODE_PRESETS: Array<{ kind: NodeKind; title: string; subtitle: string; color: string; icon: string }> = [
  { kind: "model", title: "Janus Pro 7B", subtitle: "Reasoning + vision", color: "#00d4aa", icon: "J" },
  { kind: "model", title: "Llama 3 8B", subtitle: "Instruction following", color: "#a78bfa", icon: "L" },
  { kind: "image", title: "Image output", subtitle: "Thumbnail or icon", color: "#ff6b6b", icon: "▧" },
  { kind: "code", title: "GUI planner", subtitle: "ScreenGui structure", color: "#fbbf24", icon: "▦" },
];

function NodeIcon({ node }: { node: FlowNode }) {
  return <span className="grid h-8 w-8 place-items-center rounded-lg text-[11px] font-bold text-white" style={{ background: node.color }}>{node.icon}</span>;
}

export default function WorkflowPage() {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [selectedId, setSelectedId] = useState("prompt");
  const [prompt, setPrompt] = useState("Create a cozy mushroom tycoon with upgrades and a night market");
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Ready to run");
  const selected = nodes.find((node) => node.id === selectedId) || nodes[0];
  const connections = useMemo(() => [["prompt", "model"], ["model", "image"], ["model", "code"], ["image", "output"], ["code", "output"]], []);

  function addNode(preset: typeof NODE_PRESETS[number]) {
    const id = `${preset.kind}-${Date.now()}`;
    setNodes((current) => [...current, { ...preset, id, x: 250 + (current.length % 3) * 250, y: 410 + Math.floor(current.length / 3) * 120 }]);
    setSelectedId(id);
    setStatus(`${preset.title} added to the graph`);
  }

  async function runWorkflow() {
    setRunning(true);
    setStatus("Running the connected Hugging Face workflow…");
    try {
      const [chat, image] = await Promise.all([
        fetch("/api/ai/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: prompt }) }).then((response) => response.json()),
        fetch("/api/ai/generate-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, style: "thumbnail" }) }).then((response) => response.json()),
      ]);
      if (chat.ok || image.imageUrl) setStatus("Workflow finished. Review the returned assets and AI response in the chat.");
      else setStatus(`Workflow stopped: ${chat.error || image.error || "Hugging Face returned no output"}`);
    } catch {
      setStatus("Workflow stopped: the AI provider could not be reached. No result was claimed.");
    } finally {
      setRunning(false);
    }
  }

  return <div className="min-h-[100dvh] bg-[#090a0f] text-white">
    <header className="flex h-14 items-center justify-between border-b border-white/10 bg-[#101219] px-4">
      <div className="flex items-center gap-3"><Link href="/" className="flex items-center gap-2 font-semibold"><span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-accent to-teal">✦</span>Vibe</Link><span className="text-white/20">/</span><span className="text-[13px] text-white/55">Workflow canvas</span><span className="rounded-full bg-teal/10 px-2 py-1 text-[10px] text-teal">AI graph</span></div>
      <div className="flex items-center gap-2"><Link href="/studio" className="rounded-lg border border-white/10 px-3 py-1.5 text-[11px] text-white/60 hover:bg-white/5">Open chat</Link><button onClick={runWorkflow} disabled={running} className="rounded-lg bg-gradient-to-r from-accent to-teal px-4 py-2 text-[11px] font-semibold disabled:opacity-50">{running ? "Running…" : "Run workflow ▶"}</button></div>
    </header>
    <div className="flex h-[calc(100dvh-3.5rem)] min-h-0">
      <aside className="hidden w-56 shrink-0 border-r border-white/10 bg-[#0d0f15] p-3 md:block"><p className="px-2 text-[10px] font-semibold tracking-[.16em] text-white/30">BUILD NODES</p><div className="mt-3 space-y-2">{NODE_PRESETS.map((preset) => <button key={preset.title} onClick={() => addNode(preset)} className="flex w-full items-center gap-3 rounded-xl border border-white/8 bg-white/[.025] p-2 text-left hover:border-accent/40 hover:bg-accent/5"><span className="grid h-8 w-8 place-items-center rounded-lg text-xs font-bold" style={{ background: preset.color }}>{preset.icon}</span><span><span className="block text-[11px] text-white/80">{preset.title}</span><span className="mt-0.5 block text-[10px] text-white/35">{preset.subtitle}</span></span><span className="ml-auto text-white/30">＋</span></button>)}</div><div className="mt-8 rounded-xl border border-teal/15 bg-teal/5 p-3"><p className="text-[11px] text-teal">How it works</p><p className="mt-2 text-[10px] leading-relaxed text-white/40">Connect a brief to a model, then route the result into an image or Luau output.</p></div></aside>
      <main className="relative min-w-0 flex-1 overflow-auto" style={{ backgroundImage: "radial-gradient(circle at 50% 30%, rgba(124,92,252,.12), transparent 34rem), linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)", backgroundSize: "auto, 28px 28px, 28px 28px" }}>
        <div className="absolute left-5 top-5 flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-[10px] text-white/45 backdrop-blur"><span className="h-1.5 w-1.5 rounded-full bg-teal" /> {status}</div>
        <div className="relative min-h-[760px] min-w-[1100px] p-8">
          <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">{connections.map(([from, to]) => { const a = nodes.find((node) => node.id === from); const b = nodes.find((node) => node.id === to); if (!a || !b) return null; return <path key={`${from}-${to}`} d={`M ${a.x + 220} ${a.y + 62} C ${a.x + 270} ${a.y + 62}, ${b.x - 35} ${b.y + 62}, ${b.x} ${b.y + 62}`} fill="none" stroke="rgba(124,92,252,.55)" strokeWidth="2" strokeDasharray="5 5" />; })}</svg>
          {nodes.map((node) => <button key={node.id} onClick={() => setSelectedId(node.id)} className={`absolute w-[220px] rounded-2xl border p-3 text-left shadow-2xl transition ${selectedId === node.id ? "border-accent/70 bg-[#202031] shadow-accent/10" : "border-white/10 bg-[#151820]/95 hover:border-white/25"}`} style={{ left: node.x, top: node.y }}><div className="flex items-start gap-3"><NodeIcon node={node} /><span className="min-w-0 flex-1"><span className="block truncate text-[12px] font-semibold text-white/85">{node.title}</span><span className="mt-1 block truncate text-[10px] text-white/40">{node.subtitle}</span></span><span className="text-[10px] text-white/25">•••</span></div><div className="mt-3 flex items-center justify-between border-t border-white/8 pt-2 text-[9px] text-white/30"><span>{node.kind.toUpperCase()}</span><span className="text-teal/70">ready</span></div></button>)}
        </div>
      </main>
      <aside className="hidden w-72 shrink-0 border-l border-white/10 bg-[#0d0f15] p-4 lg:block"><p className="text-[10px] font-semibold tracking-[.16em] text-white/30">INSPECTOR</p><div className="mt-4 flex items-center gap-3"><NodeIcon node={selected} /><div><p className="text-[13px] font-medium">{selected.title}</p><p className="text-[10px] text-white/35">{selected.subtitle}</p></div></div><label className="mt-6 block text-[10px] text-white/35">PROMPT INPUT<textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} className="mt-2 min-h-32 w-full resize-none rounded-xl border border-white/10 bg-black/20 p-3 text-[11px] leading-relaxed text-white/75 outline-none focus:border-accent/50" /></label><div className="mt-4 rounded-xl border border-white/10 bg-white/[.025] p-3"><p className="text-[10px] text-white/35">MODEL ROUTE</p><p className="mt-2 text-[12px] text-white/70">{selected.kind === "image" ? "Stable Diffusion XL" : selected.kind === "code" ? "Gemma 4 E4B" : "Gemma 4 E4B → SDXL"}</p><p className="mt-2 text-[10px] leading-relaxed text-white/35">Hosted Hugging Face output is shown only when the provider returns a result.</p></div><button onClick={runWorkflow} disabled={running} className="mt-4 w-full rounded-xl bg-gradient-to-r from-accent to-teal px-3 py-3 text-[11px] font-semibold disabled:opacity-50">{running ? "Running graph…" : "Run selected graph"}</button></aside>
    </div>
  </div>;
}
