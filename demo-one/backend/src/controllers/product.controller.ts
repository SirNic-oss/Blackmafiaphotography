import { Request, Response } from "express";
import { fallbackProducts } from "../data/fallback-products";

async function fetchProductsFromDb() {
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const products = await prisma.product.findMany({
      orderBy: { id: "desc" },
    });
    await prisma.$disconnect();
    return products;
  } catch {
    return null;
  }
}

export async function getProducts(
  _req: Request,
  res: Response
) {
  console.log("[getProducts] request received");

  const dbProducts = await fetchProductsFromDb();

  if (dbProducts && dbProducts.length > 0) {
    return res.json({ products: dbProducts });
  }

  return res.json({ products: fallbackProducts });
}
