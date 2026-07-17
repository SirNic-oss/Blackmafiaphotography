import axios from "axios";
import { Product } from "@/types/product";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "https://fashion-fit-backend-7kgf.onrender.com";

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
