"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import type { AssetKind, RobloxAsset } from "@/lib/assets";

type Filter = "all" | AssetKind;

export default function AssetsPage() {
  const [assets, setAssets] = useState<RobloxAsset[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"loading" | "ready">("loading");

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ limit: "48" });
    if (filter !== "all") params.set("kind", filter);
    if (query.trim()) params.set("q", query.trim());

    fetch(`/api/assets?${params}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => {
        setAssets(data.assets || []);
        setStatus("ready");
      })
      .catch(() => setAssets([]))
      .finally(() => setStatus("ready"));
    return () => controller.abort();
  }, [filter, query]);

  return (
    <div className="min-h-[100dvh]" style={{ backgroundColor: "var(--bg)" }}>
      <header className="flex items-center justify-between px-4 md:px-8 py-4 border-b" style={{ borderColor: "var(--edge)" }}>
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-accent to-teal text-white shadow-[0_8px_28px_rgba(124,92,252,0.25)]">✦</span>
          <span className="text-[14px] font-semibold tracking-tight" style={{ color: "var(--text)" }}>Vibe Studio</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/studio" className="rounded-full px-4 py-2 text-[13px] font-medium" style={{ backgroundColor: "var(--text)", color: "var(--bg)" }}>Open Studio</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-end">
          <div>
            <p className="mb-4 text-[12px] font-medium tracking-[0.16em]" style={{ color: "var(--teal)" }}>ASSET LIBRARY / DATASET VIEW</p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl" style={{ color: "var(--text)" }}>Find the look before you build the game.</h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Browse Roblox game icons and thumbnails from your uploaded archive, then send a visual direction into Studio.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-[1.5rem] border p-5" style={{ backgroundColor: "var(--card)", borderColor: "var(--edge)" }}>
            <div className="absolute -right-8 -top-12 h-32 w-32 rounded-full bg-teal/10 blur-2xl" />
            <div className="relative flex items-start justify-between gap-4">
              <div><p className="text-[11px] font-medium" style={{ color: "var(--text-faint)" }}>UPLOADED ARCHIVE</p><p className="mt-1 text-2xl font-semibold" style={{ color: "var(--text)" }}>143,865</p></div>
              <span className="rounded-full px-2.5 py-1 text-[10px]" style={{ backgroundColor: "rgba(0,212,170,0.1)", color: "var(--teal)" }}>research set</span>
            </div>
            <p className="relative mt-5 text-[12px] leading-relaxed" style={{ color: "var(--text-muted)" }}>43,115 icons · 100,750 thumbnails · 1 curated sample shipped with the app</p>
          </div>
        </motion.div>

        <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            {(["all", "icon", "thumbnail"] as Filter[]).map((item) => (
              <button key={item} onClick={() => setFilter(item)} className="rounded-full border px-4 py-2 text-[12px] capitalize transition-colors" style={{ backgroundColor: filter === item ? "var(--text)" : "var(--bg-overlay)", borderColor: filter === item ? "var(--text)" : "var(--edge)", color: filter === item ? "var(--bg)" : "var(--text-muted)" }}>{item === "all" ? "Everything" : `${item}s`}</button>
            ))}
          </div>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by asset id..." className="w-full rounded-full border px-4 py-2.5 text-[13px] outline-none md:max-w-xs" style={{ backgroundColor: "var(--bg-overlay)", borderColor: "var(--edge)", color: "var(--text)" }} />
        </div>

        {status === "loading" ? <div className="py-24 text-center text-[13px]" style={{ color: "var(--text-muted)" }}>Indexing the local library…</div> : assets.length === 0 ? <div className="py-24 text-center text-[13px]" style={{ color: "var(--text-muted)" }}>No assets match that search.</div> : (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {assets.map((asset, index) => (
              <motion.figure key={asset.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.025, 0.35) }} className="group overflow-hidden rounded-[1.25rem] border" style={{ backgroundColor: "var(--card)", borderColor: "var(--edge)" }}>
                <div className={`relative overflow-hidden ${asset.kind === "thumbnail" ? "aspect-video" : "aspect-square"}`} style={{ backgroundColor: "var(--bg-overlay)" }}><img src={asset.url} alt={asset.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8"><span className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/70">{asset.kind}</span></div></div>
                <figcaption className="p-3"><p className="truncate text-[12px] font-medium" style={{ color: "var(--text)" }}>{asset.name}</p><p className="mt-1 text-[10px]" style={{ color: "var(--text-faint)" }}>{asset.dimensions} · {asset.source === "uploaded-dataset" ? "uploaded dataset" : "local library"}</p></figcaption>
              </motion.figure>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
