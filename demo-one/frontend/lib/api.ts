import axios from "axios";
import { Product } from "@/types/product";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL,
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
