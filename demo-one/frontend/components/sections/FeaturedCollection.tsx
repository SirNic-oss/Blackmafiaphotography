"use client";

import ProductCarousel from "@/components/products/ProductCarousel";
import { useProducts } from "@/hooks/useProducts";

export default function FeaturedCollection() {
  const { products, loading, error } = useProducts();

  return (
    <section className="py-40">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-white text-6xl mb-12">
          Featured Collection
        </h2>

        {loading && (
          <p className="text-zinc-400">Loading collection…</p>
        )}

        {error && (
          <p className="text-red-400">
            Could not load products. Is the backend running on port
            5000?
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <ProductCarousel products={products} />
        )}

        {!loading && !error && products.length === 0 && (
          <p className="text-zinc-400">No products available yet.</p>
        )}
      </div>
    </section>
  );
}
