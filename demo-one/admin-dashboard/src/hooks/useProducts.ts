"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { getProducts } from "@/services/product.service";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error, setProducts };
}
