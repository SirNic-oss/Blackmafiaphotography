"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/media";

export type PortfolioItem = { id: string; title: string; category: string; imageUrl: string; altText: string | null };
export default function PortfolioGrid({ limit }: { limit?: number }) {
  const [items, setItems] = useState<PortfolioItem[]>([]); const [selected, setSelected] = useState("All"); const [loading, setLoading] = useState(true);
  useEffect(() => { api.get<{ items: PortfolioItem[] }>("/api/portfolio").then(({ data }) => setItems(data.items)).catch(() => setItems([])).finally(() => setLoading(false)); }, []);
  const categories = ["All", ...Array.from(new Set(items.map((item) => item.category)))];
  const filtered = useMemo(() => items.filter((item) => selected === "All" || item.category === selected).slice(0, limit), [items, selected, limit]);
  return <div>{loading && <p className="text-zinc-400">Loading portfolio…</p>}{!limit && !loading && <div className="mb-8 flex flex-wrap gap-2">{categories.map((category) => <button key={category} onClick={() => setSelected(category)} className={`rounded-full px-4 py-2 text-sm ${selected === category ? "bg-white text-black" : "border border-white/15 text-zinc-300"}`}>{category}</button>)}</div>}<div className="columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3">{filtered.map((item) => <figure key={item.id} className="break-inside-avoid overflow-hidden rounded-2xl bg-white/5"><img src={resolveMediaUrl(item.imageUrl)} alt={item.altText || item.title} className="w-full object-cover transition duration-500 hover:scale-105" /><figcaption className="p-4"><p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{item.category}</p><p className="mt-1 text-lg text-white">{item.title}</p></figcaption></figure>)}</div>{!loading && !items.length && <p className="text-zinc-400">The portfolio is being prepared. Please check back soon.</p>}</div>;
}
