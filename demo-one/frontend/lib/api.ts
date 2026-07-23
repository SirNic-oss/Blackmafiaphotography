import axios from "axios";
import { Product } from "@/types/product";

export const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get<{ products: Product[] }>(
    "/api/products"
  );
  return data.products;
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data } = await api.get<Product>(`/api/products/${id}`);
    if (data?.id) {
      return data;
    }
  } catch {
    // Fall through to list lookup below.
  }

  try {
    const products = await getProducts();
    return products.find((product) => product.id === id) ?? null;
  } catch {
    return null;
  }
}
