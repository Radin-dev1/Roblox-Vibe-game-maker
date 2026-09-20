"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AI_MODELS } from "@/lib/models";

type Tool = "select" | "move" | "rotate" | "scale" | "terrain";
type Mode = "3d" | "thumbnail" | "gui" | "code" | "animation" | "ugc";
type SkyPreset = "clear" | "sunset" | "space" | "studio";

interface SceneNode {
  id: string;
  name: string;
  kind: "baseplate" | "spawn" | "tree" | "house" | "cloud" | "model" | "script";
  x: number;
  y: number;
  z: number;
  color: string;
  visible: boolean;
}

const INITIAL_SCENE: SceneNode[] = [
  { id: "baseplate", name: "Baseplate", kind: "baseplate", x: 0, y: 0, z: 0, color: "#7b8792", visible: true },
  { id: "spawn", name: "SpawnLocation", kind: "spawn", x: 0, y: 0, z: 0, color: "#48a4ff", visible: true },
  { id: "tree", name: "OakTree", kind: "tree", x: -24, y: 0, z: -10, color: "#5ac67d", visible: true },
  { id: "house", name: "StarterHouse", kind: "house", x: 20, y: 0, z: -12, color: "#efb45c", visible: true },
  { id: "cloud", name: "Cloud_01", kind: "cloud", x: 8, y: 28, z: -4, color: "#ffffff", visible: true },
];

const MODES: Array<{ id: Mode; label: string; icon: string; description: string; model: string }> = [
  { id: "3d", label: "3D asset", icon: "◇", description: "Generate a blocky prop or character", model: "z-image-turbo" },
  { id: "thumbnail", label: "Thumbnail", icon: "▧", description: "Create a game icon or 16:9 cover", model: "flux-dev" },
  { id: "gui", label: "GUI", icon: "▦", description: "Plan a responsive ScreenGui", model: "janus-pro" },
  { id: "code", label: "Luau", icon: "</>", description: "Write a typed game system", model: "gemma-4" },
  { id: "animation", label: "Animation", icon: "◌", description: "Draft a keyframe or tween sequence", model: "gemma-4" },
  { id: "ugc", label: "UGC", icon: "✦", description: "Shape a wearable or avatar item", model: "pixal3d" },
];

const ANIMATIONS = ["Idle", "Walk", "Run", "Jump", "Wave"];

const skyStyles: Record<SkyPreset, string> = {
  clear: "linear-gradient(180deg, #5f9fdb 0%, #a8d7ed 45%, #d8e9dd 100%)",
  sunset: "linear-gradient(180deg, #39284d 0%, #c86f68 44%, #f5b36a 70%, #293344 100%)",
  space: "radial-gradient(circle at 68% 28%, rgba(106,85,255,.45), transparent 18%), linear-gradient(180deg, #050819 0%, #111946 55%, #272e55 100%)",
  studio: "linear-gradient(180deg, #c4d0da 0%, #e2e7ea 46%, #b8c0c6 100%)",
};

function Icon({ children }: { children: React.ReactNode }) {
  return <span className="grid h-7 w-7 place-items-center rounded-lg text-[13px]">{children}</span>;
}

function SceneObject({ node, selected, onSelect }: { node: SceneNode; selected: boolean; onSelect: () => void }) {
  if (!node.visible || node.kind === "baseplate") return null;
  const left = 50 + node.x * 0.75;
  const top = 52 - node.z * 0.75 - node.y * 0.9;
  const common = "absolute transition-transform duration-200 cursor-pointer";
  const outline = selected ? " drop-shadow-[0_0_0.45rem_rgba(255,255,255,.9)]" : "";

  if (node.kind === "tree") return <button aria-label={node.name} onClick={onSelect} className={`${common} h-28 w-20 -translate-x-1/2 -translate-y-full${outline}`} style={{ left: `${left}%`, top: `${top}%` }}><span className="absolute bottom-0 left-1/2 h-14 w-5 -translate-x-1/2 rounded-md bg-[#82563d] shadow-[inset_-4px_0_rgba(0,0,0,.15)]" /><span className="absolute left-1/2 top-0 h-20 w-20 -translate-x-1/2 rounded-[48%] bg-[#4fba72] shadow-[inset_-10px_-8px_rgba(18,86,51,.18)]" /><span className="absolute left-4 top-9 h-14 w-14 rounded-full bg-[#67cf86]" /></button>;
  if (node.kind === "house") return <button aria-label={node.name} onClick={onSelect} className={`${common} h-24 w-36 -translate-x-1/2 -translate-y-full${outline}`} style={{ left: `${left}%`, top: `${top}%` }}><span className="absolute bottom-0 h-16 w-32 rounded-sm bg-[#e8b26a] shadow-[inset_-10px_-6px_rgba(120,62,40,.12)]" /><span className="absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2 border-x-[4.5rem] border-b-[3.3rem] border-x-transparent border-b-[#c96853]" /><span className="absolute bottom-3 left-1/2 h-8 w-5 -translate-x-1/2 rounded-t bg-[#714b53]" /></button>;
  if (node.kind === "cloud") return <button aria-label={node.name} onClick={onSelect} className={`${common} h-9 w-24 -translate-x-1/2 -translate-y-1/2${outline}`} style={{ left: `${left}%`, top: `${top}%` }}><span className="absolute bottom-0 left-2 h-5 w-20 rounded-full bg-white/80" /><span className="absolute left-7 top-0 h-7 w-9 rounded-full bg-white/90" /><span className="absolute left-14 top-2 h-5 w-7 rounded-full bg-white/80" /></button>;
  if (node.kind === "spawn") return <button aria-label={node.name} onClick={onSelect} className={`${common} h-9 w-9 -translate-x-1/2 -translate-y-1/2${outline}`} style={{ left: `${left}%`, top: `${top}%` }}><span className="absolute inset-0 rounded-full border-[3px] border-[#55aeff] bg-[#d9f0ff]/80 shadow-[0_0_14px_rgba(50,160,255,.7)]" /><span className="absolute left-1/2 top-1/2 h-1 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2188db]" /></button>;
  return <button aria-label={node.name} onClick={onSelect} className={`${common} h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-white/40 bg-accent/60${outline}`} style={{ left: `${left}%`, top: `${top}%` }} />;
}

export default function WorkspacePage() {
  const [tool, setTool] = useState<Tool>("select");
  const [mode, setMode] = useState<Mode>("3d");
  const [sky, setSky] = useState<SkyPreset>("clear");
  const [scene, setScene] = useState<SceneNode[]>(INITIAL_SCENE);
  const [selectedId, setSelectedId] = useState("house");
  const [activeTab, setActiveTab] = useState<"scene" | "inspector" | "sky">("scene");
  const [animation, setAnimation] = useState("Idle");
  const [playing, setPlaying] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [modelId, setModelId] = useState(MODES[0].model);
  const [generating, setGenerating] = useState(false);
  const [notice, setNotice] = useState("Ready for your next build step");

  const selected = scene.find((node) => node.id === selectedId) || scene[0];
  const currentMode = MODES.find((item) => item.id === mode)!;
  const textModels = AI_MODELS.filter((model) => model.category === "text");
  const model = AI_MODELS.find((item) => item.id === modelId) || AI_MODELS[0];

  const skyDots = useMemo(() => Array.from({ length: sky === "space" ? 28 : 0 }, (_, index) => ({ left: `${(index * 37) % 96}%`, top: `${10 + ((index * 19) % 55)}%` })), [sky]);

  function updateSelected(patch: Partial<SceneNode>) {
    setScene((items) => items.map((item) => item.id === selected.id ? { ...item, ...patch } : item));
  }

  async function generate() {
    const text = prompt.trim() || currentMode.description;
    setGenerating(true);
    setNotice(`Sending this brief to ${model.name}…`);
    try {
      if (mode === "3d" || mode === "ugc") {
        const response = await fetch("/api/ai/generate-3d", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: text, modelId }) });
        const data = await response.json();
        const id = `generated-${Date.now()}`;
        setScene((items) => [...items, { id, name: text.slice(0, 22), kind: "model", x: 0, y: 0, z: 8, color: model.color, visible: true }]);
        setSelectedId(id);
        setNotice(data.message || `Queued a ${currentMode.label.toLowerCase()} with ${model.name}`);
      } else if (mode === "thumbnail") {
        const response = await fetch("/api/ai/generate-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: text, modelId, style: "thumbnail" }) });
        const data = await response.json();
        setNotice(data.imageUrl ? `Thumbnail ready from ${model.name}` : (data.error || "Thumbnail request queued"));
      } else {
        const response = await fetch("/api/ai/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: `${currentMode.label}: ${text}`, modelId }) });
        const data = await response.json();
        const id = `script-${Date.now()}`;
        setScene((items) => [...items, { id, name: mode === "animation" ? "AnimationController" : mode === "gui" ? "GeneratedGui" : "GeneratedSystem", kind: "script", x: 0, y: 0, z: 0, color: model.color, visible: true }]);
        setSelectedId(id);
        setNotice(data.text ? `${model.name} returned a build plan. Added it to the scene tree.` : (data.error || "Plan queued"));
      }
    } catch {
      setNotice("Provider unavailable. The local Roblox knowledge fallback is ready in Studio.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[#101216] text-white">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#17191e] px-3 text-[12px]">
        <div className="flex items-center gap-3"><Link href="/" className="flex items-center gap-2 pr-3"><span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-accent to-teal text-sm">✦</span><span className="font-semibold tracking-tight">ForgeFrame</span></Link><span className="text-white/25">/</span><span className="text-white/50">Mushroom Tycoon</span><span className="rounded bg-teal/10 px-2 py-1 text-[10px] text-teal">Saved</span></div>
        <div className="hidden items-center gap-1 md:flex"><button className="rounded-md px-3 py-1.5 text-white/45 hover:bg-white/5">File</button><button className="rounded-md px-3 py-1.5 text-white/45 hover:bg-white/5">Edit</button><button className="rounded-md px-3 py-1.5 text-white/45 hover:bg-white/5">View</button><button className="rounded-md px-3 py-1.5 text-white/45 hover:bg-white/5">Playtest</button></div>
        <div className="flex items-center gap-2"><Link href="/studio" className="hidden rounded-lg border border-white/10 px-3 py-1.5 text-[11px] text-white/55 hover:bg-white/5 sm:block">Open AI chat</Link><button onClick={() => setNotice("Project saved locally") } className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-semibold text-[#17191e]">Save</button><button onClick={() => setNotice("Publish is ready once the plugin is connected") } className="rounded-lg bg-accent px-3 py-1.5 text-[11px] font-semibold">Publish</button></div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-14 shrink-0 flex-col items-center gap-2 border-r border-white/10 bg-[#17191e] py-3">
          {([["select", "⌁"], ["move", "✣"], ["rotate", "↻"], ["scale", "↗"], ["terrain", "▦"]] as Array<[Tool, string]>).map(([id, icon]) => <button key={id} title={id} onClick={() => setTool(id)} className={`grid h-9 w-9 place-items-center rounded-lg text-lg ${tool === id ? "bg-accent text-white" : "text-white/35 hover:bg-white/5 hover:text-white"}`}>{icon}</button>)}
          <div className="my-2 h-px w-7 bg-white/10" /><button onClick={() => setNotice("Scene camera centered") } className="grid h-9 w-9 place-items-center rounded-lg text-white/35 hover:bg-white/5">⌖</button><button onClick={() => setNotice("Grid snapping toggled") } className="grid h-9 w-9 place-items-center rounded-lg text-white/35 hover:bg-white/5">▤</button><div className="mt-auto"><Link href="/assets" className="grid h-9 w-9 place-items-center rounded-lg text-white/35 hover:bg-white/5">▧</Link></div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/10 bg-[#1d2026] px-4 text-[11px] text-white/45"><div className="flex items-center gap-2"><span className="rounded bg-white/5 px-2 py-1 text-white/70">{tool === "select" ? "Select" : tool[0].toUpperCase() + tool.slice(1)}</span><span>Snap 1 stud</span><span className="hidden text-white/25 sm:inline">Local preview · skybox {sky}</span></div><div className="flex items-center gap-1"><button className="rounded px-2 py-1 hover:bg-white/5">−</button><span>100%</span><button className="rounded px-2 py-1 hover:bg-white/5">+</button><button className="ml-2 rounded bg-teal/15 px-2 py-1 text-teal" onClick={() => setNotice("Playtest preview started")}>▶ Play</button></div></div>
          <div className="relative min-h-0 flex-1 overflow-hidden" style={{ background: skyStyles[sky] }}>
            {skyDots.map((dot, index) => <span key={index} className="absolute h-1 w-1 rounded-full bg-white/70" style={dot} />)}
            <div className="absolute left-1/2 top-[16%] h-14 w-14 -translate-x-1/2 rounded-full bg-[#ffe9ae] shadow-[0_0_70px_26px_rgba(255,231,160,.25)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_54%,rgba(24,33,40,.12))]" />
            <div className="absolute bottom-[-12%] left-1/2 h-[62%] w-[135%] -translate-x-1/2 rotate-[7deg] border border-white/25 bg-[#75858d] shadow-[0_-20px_80px_rgba(37,52,59,.22)]" style={{ transformOrigin: "center bottom" }}>
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.32) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.32) 1px, transparent 1px)", backgroundSize: "34px 34px" }} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,.25),transparent_42%)]" />
            </div>
            <div className="absolute inset-0">{scene.filter((node) => node.kind !== "baseplate").map((node) => <SceneObject key={node.id} node={node} selected={selectedId === node.id} onSelect={() => setSelectedId(node.id)} />)}</div>
            <div className="absolute bottom-5 left-5 rounded-xl border border-black/10 bg-black/20 px-3 py-2 text-[10px] text-white/60 backdrop-blur-sm"><p className="text-white/80">{selected.name}</p><p className="mt-1">{selected.x}, {selected.y}, {selected.z} studs</p></div>
            <div className="absolute right-5 top-5 flex gap-1 rounded-lg border border-black/10 bg-black/20 p-1 backdrop-blur-sm"><button className="rounded px-2 py-1 text-[10px] text-white/70 hover:bg-white/10">Perspective</button><button className="rounded px-2 py-1 text-[10px] text-white/50 hover:bg-white/10">Top</button></div>
          </div>

          <div className="h-36 shrink-0 border-t border-white/10 bg-[#17191e] px-4 py-3"><div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-3"><span className="text-[11px] font-medium text-white/65">Animation editor</span><span className="rounded bg-white/5 px-2 py-1 text-[10px] text-white/35">{animation} · 24 fps</span></div><div className="flex items-center gap-2"><button onClick={() => setPlaying(!playing)} className="rounded-md bg-teal/15 px-2.5 py-1 text-[10px] text-teal">{playing ? "Pause" : "Play"}</button><button onClick={() => setNotice("New animation track created") } className="rounded-md border border-white/10 px-2.5 py-1 text-[10px] text-white/45">＋ Track</button></div></div><div className="flex gap-2 overflow-x-auto">{ANIMATIONS.map((item) => <button key={item} onClick={() => setAnimation(item)} className={`min-w-20 rounded-lg border px-3 py-2 text-left ${animation === item ? "border-accent/50 bg-accent/15 text-white" : "border-white/10 bg-white/[0.02] text-white/40"}`}><span className="block text-[10px]">{item}</span><span className="mt-2 block h-1 rounded-full bg-white/10"><span className={`block h-full rounded-full ${animation === item ? "w-3/4 bg-accent" : "w-1/3 bg-white/20"}`} /></span></button>)}</div></div>
        </main>

        <aside className="hidden w-80 shrink-0 flex-col border-l border-white/10 bg-[#17191e] lg:flex">
          <div className="flex h-11 shrink-0 border-b border-white/10"><button onClick={() => setActiveTab("scene")} className={`flex-1 text-[11px] ${activeTab === "scene" ? "border-b-2 border-accent text-white" : "text-white/35"}`}>Scene</button><button onClick={() => setActiveTab("inspector")} className={`flex-1 text-[11px] ${activeTab === "inspector" ? "border-b-2 border-accent text-white" : "text-white/35"}`}>Inspector</button><button onClick={() => setActiveTab("sky")} className={`flex-1 text-[11px] ${activeTab === "sky" ? "border-b-2 border-accent text-white" : "text-white/35"}`}>Sky</button></div>
          {activeTab === "scene" && <div className="min-h-0 flex-1 overflow-y-auto p-3"><div className="mb-3 flex items-center justify-between"><span className="text-[10px] font-medium tracking-[0.12em] text-white/35">WORKSPACE</span><button onClick={() => setNotice("New part inserted") } className="rounded bg-white/5 px-2 py-1 text-[12px] text-white/55">＋</button></div><div className="space-y-1">{scene.map((node) => <button key={node.id} onClick={() => setSelectedId(node.id)} className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] ${selectedId === node.id ? "bg-accent/15 text-white" : "text-white/50 hover:bg-white/5"}`}><Icon>{node.kind === "script" ? "⌘" : node.kind === "baseplate" ? "▤" : node.kind === "tree" ? "♣" : node.kind === "house" ? "⌂" : node.kind === "cloud" ? "☁" : "○"}</Icon><span className="flex-1 truncate">{node.name}</span><span className="text-[9px] text-white/25">{node.kind}</span></button>)}</div><div className="mt-5 rounded-xl border border-white/10 bg-white/[0.025] p-3"><p className="text-[10px] font-medium text-white/40">GENERATION MODE</p><div className="mt-2 grid grid-cols-2 gap-1.5">{MODES.map((item) => <button key={item.id} onClick={() => { setMode(item.id); setModelId(item.model); }} className={`rounded-lg border px-2 py-2 text-left ${mode === item.id ? "border-accent/40 bg-accent/10" : "border-white/10"}`}><span className="text-[14px] text-white/75">{item.icon}</span><span className="mt-1 block text-[10px] text-white/65">{item.label}</span></button>)}</div><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder={currentMode.description} rows={3} className="mt-3 w-full resize-none rounded-lg border border-white/10 bg-black/10 p-2.5 text-[11px] text-white outline-none placeholder:text-white/25 focus:border-accent/50" /><div className="mt-2 flex items-center gap-2"><select value={modelId} onChange={(event) => setModelId(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#20242b] px-2 py-2 text-[10px] text-white/65 outline-none">{(mode === "code" || mode === "gui" || mode === "animation" ? textModels : AI_MODELS.filter((item) => item.id === currentMode.model || item.category === "image-2d" || item.category === "image-3d")).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><button onClick={generate} disabled={generating} className="rounded-lg bg-gradient-to-r from-accent to-teal px-3 py-2 text-[10px] font-semibold text-white disabled:opacity-50">{generating ? "Working…" : "Generate"}</button></div><p className="mt-2 text-[10px] leading-relaxed text-white/30">Keyless mode is on. If a hosted model is unavailable, Vibe keeps the build moving with local Roblox patterns.</p></div><p className="mt-3 text-[10px] text-teal/70">{notice}</p></div>}
          {activeTab === "inspector" && <div className="space-y-4 p-4"><div><p className="text-[10px] font-medium tracking-[0.12em] text-white/35">SELECTED OBJECT</p><input value={selected.name} onChange={(event) => updateSelected({ name: event.target.value })} className="mt-2 w-full rounded-lg border border-white/10 bg-black/10 px-3 py-2 text-[12px] text-white outline-none focus:border-accent/50" /></div><div className="grid grid-cols-3 gap-2">{(["x", "y", "z"] as const).map((axis) => <label key={axis} className="text-[10px] text-white/35">{axis.toUpperCase()}<input type="number" value={selected[axis]} onChange={(event) => updateSelected({ [axis]: Number(event.target.value) })} className="mt-1 w-full rounded-lg border border-white/10 bg-black/10 px-2 py-2 text-[11px] text-white outline-none" /></label>)}</div><div className="rounded-xl border border-white/10 bg-white/[0.025] p-3"><p className="text-[10px] font-medium text-white/40">APPEARANCE</p><div className="mt-3 flex items-center justify-between"><span className="text-[11px] text-white/55">Visible</span><button onClick={() => updateSelected({ visible: !selected.visible })} className={`h-5 w-9 rounded-full p-0.5 ${selected.visible ? "bg-teal" : "bg-white/20"}`}><span className={`block h-4 w-4 rounded-full bg-white transition-transform ${selected.visible ? "translate-x-4" : "translate-x-0"}`} /></button></div></div><button onClick={() => setNotice(`${selected.name} is ready to sync through the plugin`)} className="w-full rounded-lg border border-teal/25 bg-teal/10 px-3 py-2 text-[11px] text-teal">Sync selected object</button></div>}
          {activeTab === "sky" && <div className="space-y-4 p-4"><div><p className="text-[10px] font-medium tracking-[0.12em] text-white/35">ENVIRONMENT</p><h2 className="mt-1 text-lg font-semibold">Set the mood</h2><p className="mt-1 text-[11px] leading-relaxed text-white/35">Preview the sky, baseplate, and lighting before you send it to Studio.</p></div><div className="grid grid-cols-2 gap-2">{(Object.keys(skyStyles) as SkyPreset[]).map((preset) => <button key={preset} onClick={() => setSky(preset)} className={`rounded-xl border p-2 text-left ${sky === preset ? "border-accent/50" : "border-white/10"}`}><span className="block h-12 rounded-lg" style={{ background: skyStyles[preset] }} /><span className="mt-2 block text-[10px] capitalize text-white/55">{preset}</span></button>)}</div><div className="rounded-xl border border-white/10 bg-white/[0.025] p-3"><div className="flex items-center justify-between"><span className="text-[11px] text-white/55">Baseplate grid</span><span className="text-[10px] text-teal">On</span></div><div className="mt-3 flex items-center justify-between"><span className="text-[11px] text-white/55">Cloud layer</span><span className="text-[10px] text-teal">On</span></div></div></div>}
        </aside>
      </div>
    </div>
  );
}
