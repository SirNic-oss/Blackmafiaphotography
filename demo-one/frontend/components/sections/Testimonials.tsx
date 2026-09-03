"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Testimonial = {
  id: string;
  clientName: string;
  quote: string;
  rating: number;
  category: string | null;
};

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ testimonials: Testimonial[] }>("/api/testimonials")
      .then(({ data }) => setItems(data.testimonials))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-40 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-white text-4xl md:text-6xl">Testimonials</h2>
        {loading && <p className="mt-10 text-zinc-400">Loading testimonials…</p>}
        {!loading && !items.length && (
          <p className="mt-10 text-zinc-400">Client testimonials will appear here once published in the admin dashboard.</p>
        )}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {items.map((item) => (
            <div key={item.id} className="bg-white/5 p-8 rounded-3xl">
              <p className="text-sm text-zinc-500">{item.clientName}{item.category ? ` · ${item.category}` : ""}</p>
              <p className="mt-4 text-white leading-7">&ldquo;{item.quote}&rdquo;</p>
              <p className="mt-4 text-sm text-zinc-400">{item.rating}/5</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
