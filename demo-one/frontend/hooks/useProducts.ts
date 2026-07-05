"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api";
import { Product } from "@/types/product";

let cachedProducts: Product[] | null = null;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(
    cachedProducts ?? []
  );
  const [loading, setLoading] = useState(!cachedProducts);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedProducts) {
      return;
    }

    let cancelled = false;

    getProducts()
      .then((data) => {
        if (cancelled) {
          return;
        }
        cachedProducts = data;
        setProducts(data);
      })
      .catch((err: unknown) => {
        if (cancelled) {
          return;
        }
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load products";
        setError(message);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading, error };
}
