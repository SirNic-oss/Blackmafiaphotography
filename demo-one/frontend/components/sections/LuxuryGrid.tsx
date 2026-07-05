"use client";

import { useProducts } from "@/hooks/useProducts";

export default function LuxuryGrid() {
  const { products, loading, error } = useProducts();

  return (
    <section className="py-40 px-10">
      <h2 className="text-white text-6xl mb-16">Collections</h2>

      {loading && (
        <p className="text-zinc-400">Loading collections…</p>
      )}

      {error && (
        <p className="text-red-400">
          Could not load collections from the API.
        </p>
      )}

      {!loading && !error && (
        <div className="columns-1 md:columns-2 xl:columns-3 gap-8 space-y-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="break-inside-avoid rounded-3xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-80 object-cover"
              />

              <div className="p-6">
                <p className="text-zinc-500 text-sm uppercase tracking-widest">
                  {product.category}
                </p>
                <h3 className="text-white text-2xl mt-1">
                  {product.name}
                </h3>
                <p className="text-white mt-3">R{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
