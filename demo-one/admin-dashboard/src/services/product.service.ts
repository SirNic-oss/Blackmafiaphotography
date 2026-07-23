import api from "@/lib/api";
import type { Product } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get("/api/products");
  return data.products;
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data } = await api.get(`/api/products/${id}`);
    return data;
  } catch {
    return null;
  }
}

export async function createProduct(
  product: Omit<Product, "id">
): Promise<Product> {
  const { data } = await api.post("/api/products", product);
  return data;
}

export async function updateProduct(
  id: string,
  product: Partial<Product>
): Promise<Product> {
  const { data } = await api.put(`/api/products/${id}`, product);
  return data;
}

export async function deleteProduct(
  id: string
): Promise<boolean> {
  await api.delete(`/api/products/${id}`);
  return true;
}