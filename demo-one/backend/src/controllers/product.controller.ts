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
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};
