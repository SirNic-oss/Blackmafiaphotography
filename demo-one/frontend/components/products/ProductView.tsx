"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProductById } from "@/lib/api";
import { Product } from "@/types/product";
import ProductDetail from "./ProductDetail";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface ProductViewProps {
  productId: string;
}

export default function ProductView({ productId }: ProductViewProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getProductById(productId)
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
        setError(!data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center pt-32">
        <LoadingSpinner label="Loading product…" />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 pt-32">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Product Not Found</h1>
          <p className="mt-4 text-zinc-400 max-w-md">
            We could not load this product. It may have been removed or the
            store API is temporarily unavailable.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block bg-white text-black px-8 py-4 rounded-full"
          >
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  return <ProductDetail product={product} />;
}
