import api from "@/lib/api";
import type { Product } from "@/types/product";

const mockProducts: Product[] = [
  {
    id: "seed-1",
    name: "Luxury Runner",
    category: "Shoes",
    description: "Premium lightweight runner with sculpted sole.",
    price: 3500,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"],
    colors: ["Black", "White"],
    sizes: ["8", "9", "10", "11"],
    stock: 24,
  },
  {
    id: "seed-2",
    name: "Obsidian High",
    category: "Shoes",
    description: "High-top silhouette in matte black leather.",
    price: 4200,
    images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80"],
    colors: ["Black"],
    sizes: ["7", "8", "9", "10"],
    stock: 18,
  },
  {
    id: "seed-3",
    name: "Silk Blazer",
    category: "Outerwear",
    description: "Tailored blazer in midnight silk blend.",
    price: 6800,
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80"],
    colors: ["Navy", "Charcoal"],
    sizes: ["S", "M", "L", "XL"],
    stock: 12,
  },
];

export async function getProducts(): Promise<Product[]> {
  try {
    const { data } = await api.get<{ products: Product[] }>("/api/products");
    return data.products ?? [];
  } catch {
    return mockProducts;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id) ?? null;
}

export async function createProduct(product: Omit<Product, "id">): Promise<Product> {
  return { id: `new-${Date.now()}`, ...product };
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const product = await getProductById(id);
  if (!product) return null;
  return { ...product, ...updates };
}

export async function deleteProduct(_id: string): Promise<boolean> {
  return true;
}
