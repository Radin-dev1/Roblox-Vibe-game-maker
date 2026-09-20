"use client";

import { useState } from "react";
import Link from "next/link";

type FlowNode = { id: string; kind: string; title: string; subtitle: string; x: number; y: number; color: string; icon: string };
type NodePreset = Omit<FlowNode, "id" | "x" | "y"> & { group: string };

const INITIAL_NODES: FlowNode[] = [
  { id: "prompt", kind: "brief", title: "Game brief", subtitle: "Describe your Roblox idea", x: 70, y: 160, color: "#7667e8", icon: "✦" },
  { id: "model", kind: "model", title: "Gemma 4 E4B", subtitle: "Luau + planning", x: 370, y: 160, color: "#4285f4", icon: "G" },
  { id: "image", kind: "image", title: "SDXL thumbnails", subtitle: "Hugging Face · image", x: 680, y: 65, color: "#e56b6f", icon: "F" },
  { id: "code", kind: "code", title: "Luau system", subtitle: "Roblox server script", x: 680, y: 265, color: "#159a82", icon: "</>" },
  { id: "output", kind: "output", title: "Build results", subtitle: "Review before Studio", x: 990, y: 160, color: "#c58b23", icon: "↗" },
];

const NODE_PRESETS: NodePreset[] = [
  { group: "Plan", kind: "brief", title: "Game brief", subtitle: "Turn an idea into a plan", color: "#7667e8", icon: "✦" },
  { group: "Plan", kind: "style", title: "Style direction", subtitle: "Palette, mood, references", color: "#c06b9d", icon: "◈" },
  { group: "Plan", kind: "branch", title: "Condition", subtitle: "Route by a decision", color: "#b27527", icon: "⑂" },
  { group: "AI", kind: "model", title: "Gemma 4 E4B", subtitle: "Luau + planning", color: "#4285f4", icon: "G" },
  { group: "AI", kind: "model", title: "Janus Pro 7B", subtitle: "Reasoning + vision", color: "#159a82", icon: "J" },
  { group: "AI", kind: "model", title: "Llama 3 8B", subtitle: "Instruction following", color: "#8164c5", icon: "L" },
  { group: "Visuals", kind: "image", title: "Image generation", subtitle: "Thumbnail, icon, concept", color: "#e56b6f", icon: "▧" },
  { group: "Visuals", kind: "image-edit", title: "Image edit", subtitle: "Mask, remove, remix", color: "#d47744", icon: "✎" },
  { group: "Visuals", kind: "video", title: "Video generation", subtitle: "Reveal, trailer, loop", color: "#8b68b8", icon: "▶" },
  { group: "Visuals", kind: "animate", title: "Animate", subtitle: "Character and object motion", color: "#3c8fa3", icon: "⌁" },
  { group: "3D & Roblox", kind: "model-3d", title: "3D asset", subtitle: "Generate a Roblox-ready model", color: "#d18a34", icon: "◇" },
  { group: "3D & Roblox", kind: "texture", title: "Texture / material", subtitle: "Surface, decal, PBR set", color: "#a37a51", icon: "▦" },
  { group: "3D & Roblox", kind: "gui", title: "GUI set", subtitle: "ScreenGui and HUD layout", color: "#4f86bf", icon: "▤" },
  { group: "3D & Roblox", kind: "code", title: "Luau code", subtitle: "Server, client, module", color: "#159a82", icon: "</>" },
  { group: "3D & Roblox", kind: "audio", title: "Audio cue", subtitle: "SFX and music direction", color: "#b85d75", icon: "♫" },
  { group: "References", kind: "reference", title: "Reference upload", subtitle: "Use an image as guidance", color: "#64748b", icon: "↥" },
  { group: "References", kind: "dataset", title: "Thumbnail dataset", subtitle: "Match your uploaded style", color: "#708c55", icon: "▥" },
  { group: "Output", kind: "merge", title: "Merge", subtitle: "Combine branches", color: "#62748f", icon: "⊕" },
  { group: "Output", kind: "export", title: "Export PNG / ZIP", subtitle: "Download a creator pack", color: "#5c7fba", icon: "⇩" },
  { group: "Output", kind: "export-3d", title: "Export GLB", subtitle: "Download a 3D asset", color: "#bf7d2f", icon: "⬡" },
  { group: "Output", kind: "plugin", title: "Roblox plugin sync", subtitle: "Send a verified pack to Studio", color: "#d05a58", icon: "◉" },
  { group: "Output", kind: "review", title: "Review", subtitle: "Check before publishing", color: "#6e6a9e", icon: "✓" },
];

function NodeIcon({ node }: { node: FlowNode | NodePreset }) {
  return <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[11px] font-bold text-white shadow-sm" style={{ background: node.color }}>{node.icon}</span>;
}

export default function WorkflowPage() {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [connections, setConnections] = useState<Array<[string, string]>>([["prompt", "model"], ["model", "image"], ["model", "code"], ["image", "output"], ["code", "output"]]);
  const [selectedId, setSelectedId] = useState("prompt");
  const [prompt, setPrompt] = useState("Create a cozy mushroom tycoon with upgrades and a night market");
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Ready to run");
  const selected = nodes.find((node) => node.id === selectedId) || nodes[0];

  function addNode(preset: NodePreset) {
    const id = `${preset.kind}-${Date.now()}`;
    setNodes((current) => [...current, { ...preset, id, x: 250 + (current.length % 3) * 250, y: 410 + Math.floor(current.length / 3) * 120 }]);
    setConnections((current) => [...current, [selectedId, id]]);
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

  return <div className="min-h-[100dvh] bg-[#f3f0e9] text-[#20242b]">
    <header className="flex h-14 items-center justify-between border-b border-[#d9d6ce] bg-[#fcfbf8] px-4 shadow-[0_1px_8px_rgba(40,35,25,.04)]">
      <div className="flex items-center gap-3"><Link href="/" className="flex items-center gap-2 font-semibold"><span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[#7667e8] to-[#159a82] text-white">✦</span>Vibe</Link><span className="text-[#c4c0b6]">/</span><span className="text-[13px] text-[#737a86]">Workflow canvas</span><span className="rounded-full border border-[#d8e8e3] bg-[#effaf7] px-2 py-1 text-[10px] font-medium text-[#15816f]">AI graph</span></div>
      <div className="flex items-center gap-2"><Link href="/studio" className="rounded-lg border border-[#d9d6ce] bg-white px-3 py-1.5 text-[11px] text-[#667085] hover:border-[#b9b3a7] hover:bg-[#f7f5f0]">Open chat</Link><button onClick={runWorkflow} disabled={running} className="rounded-lg bg-gradient-to-r from-[#7667e8] to-[#159a82] px-4 py-2 text-[11px] font-semibold text-white shadow-sm disabled:opacity-50">{running ? "Running…" : "Run workflow ▶"}</button></div>
    </header>
    <div className="flex h-[calc(100dvh-3.5rem)] min-h-0">
      <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-[#d9d6ce] bg-[#fbfaf7] p-3 md:block"><p className="px-2 text-[10px] font-semibold tracking-[.16em] text-[#8b919a]">BUILD NODES</p><p className="px-2 pt-1 text-[10px] leading-relaxed text-[#a0a5ad]">Drop a capability into your game pipeline.</p><div className="mt-3 space-y-3">{[...new Set(NODE_PRESETS.map((preset) => preset.group))].map((group) => <div key={group}><p className="mb-1 px-2 text-[9px] font-semibold uppercase tracking-[.13em] text-[#a6a199]">{group}</p><div className="space-y-1.5">{NODE_PRESETS.filter((preset) => preset.group === group).map((preset) => <button key={preset.title} onClick={() => addNode(preset)} className="flex w-full items-center gap-3 rounded-xl border border-[#e4e1da] bg-white p-2 text-left shadow-[0_1px_2px_rgba(35,30,20,.03)] hover:border-[#b9b0ed] hover:bg-[#faf9ff]"><NodeIcon node={preset} /><span className="min-w-0"><span className="block truncate text-[11px] font-medium text-[#30343b]">{preset.title}</span><span className="mt-0.5 block truncate text-[10px] text-[#8b919a]">{preset.subtitle}</span></span><span className="ml-auto text-[#a6aab2]">＋</span></button>)}</div></div>)}</div></aside>
      <main className="relative min-w-0 flex-1 overflow-auto" style={{ backgroundImage: "radial-gradient(circle at 50% 30%, rgba(118,103,232,.11), transparent 34rem), linear-gradient(rgba(112,108,98,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(112,108,98,.10) 1px, transparent 1px)", backgroundSize: "auto, 28px 28px, 28px 28px" }}>
        <div className="absolute left-5 top-5 flex items-center gap-2 rounded-lg border border-[#d9d6ce] bg-[#fffdf9]/90 px-3 py-2 text-[10px] text-[#737a86] shadow-sm backdrop-blur"><span className="h-1.5 w-1.5 rounded-full bg-[#159a82]" /> {status}</div>
        <div className="relative min-h-[760px] min-w-[1100px] p-8">
          <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">{connections.map(([from, to]) => { const a = nodes.find((node) => node.id === from); const b = nodes.find((node) => node.id === to); if (!a || !b) return null; return <path key={`${from}-${to}`} d={`M ${a.x + 220} ${a.y + 62} C ${a.x + 270} ${a.y + 62}, ${b.x - 35} ${b.y + 62}, ${b.x} ${b.y + 62}`} fill="none" stroke="rgba(118,103,232,.48)" strokeWidth="2" strokeDasharray="5 5" />; })}</svg>
          {nodes.map((node) => <button key={node.id} onClick={() => setSelectedId(node.id)} className={`absolute w-[220px] rounded-2xl border p-3 text-left transition ${selectedId === node.id ? "border-[#7667e8] bg-[#fffdf9] shadow-[0_10px_28px_rgba(94,80,180,.14)]" : "border-[#d8d4ca] bg-[#fffdfa]/95 shadow-[0_4px_16px_rgba(50,45,35,.07)] hover:border-[#b9b0ed]"}`} style={{ left: node.x, top: node.y }}><div className="flex items-start gap-3"><NodeIcon node={node} /><span className="min-w-0 flex-1"><span className="block truncate text-[12px] font-semibold text-[#30343b]">{node.title}</span><span className="mt-1 block truncate text-[10px] text-[#8b919a]">{node.subtitle}</span></span><span className="text-[10px] text-[#b2b4ba]">•••</span></div><div className="mt-3 flex items-center justify-between border-t border-[#ece9e2] pt-2 text-[9px] text-[#9a9ea5]"><span>{node.kind.toUpperCase()}</span><span className="font-medium text-[#159a82]">ready</span></div></button>)}
        </div>
      </main>
      <aside className="hidden w-72 shrink-0 border-l border-[#d9d6ce] bg-[#fbfaf7] p-4 lg:block"><p className="text-[10px] font-semibold tracking-[.16em] text-[#8b919a]">INSPECTOR</p><div className="mt-4 flex items-center gap-3"><NodeIcon node={selected} /><div><p className="text-[13px] font-medium text-[#30343b]">{selected.title}</p><p className="text-[10px] text-[#8b919a]">{selected.subtitle}</p></div></div><label className="mt-6 block text-[10px] text-[#8b919a]">PROMPT INPUT<textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} className="mt-2 min-h-32 w-full resize-none rounded-xl border border-[#d9d6ce] bg-white p-3 text-[11px] leading-relaxed text-[#4d5561] outline-none focus:border-[#7667e8]" /></label><div className="mt-4 rounded-xl border border-[#e0ddd5] bg-white p-3"><p className="text-[10px] text-[#8b919a]">MODEL ROUTE</p><p className="mt-2 text-[12px] text-[#4d5561]">{selected.kind === "image" ? "Stable Diffusion XL" : selected.kind === "code" ? "Gemma 4 E4B" : "Gemma 4 E4B → SDXL"}</p><p className="mt-2 text-[10px] leading-relaxed text-[#8b919a]">Hosted Hugging Face output is shown only when the provider returns a result.</p></div><button onClick={runWorkflow} disabled={running} className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#7667e8] to-[#159a82] px-3 py-3 text-[11px] font-semibold text-white shadow-sm disabled:opacity-50">{running ? "Running graph…" : "Run selected graph"}</button></aside>
    </div>
  </div>;
}
