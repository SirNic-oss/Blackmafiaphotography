"use client";

import ProductCard from "@/components/products/ProductCard";
import { useProducts } from "@/hooks/useProducts";

export default function ShopPage() {
  const { products, loading, error } = useProducts();

  return (
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-white text-6xl font-bold mb-4">Shop</h1>
        <p className="text-zinc-400 text-lg mb-16 max-w-2xl">
          Explore the full Fashion Fit collection, loaded from your
          backend API.
        </p>

        {loading && (
          <p className="text-zinc-400">Loading products…</p>
        )}

        {error && (
          <p className="text-red-400">
            Could not load products. Check that the backend is
            running and{" "}
            <code className="text-zinc-300">
              NEXT_PUBLIC_API_URL
            </code>{" "}
            is set correctly.
          </p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
