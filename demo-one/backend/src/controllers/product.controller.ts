import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { fallbackProducts } from "../data/fallback-products";

const prisma = new PrismaClient();

async function fetchProductsFromDb() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        id: "desc",
      },
    });

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
    return res.json({
      products: dbProducts,
    });
  }

  return res.json({
    products: fallbackProducts,
  });
}

export async function getProductById(
  req: Request,
  res: Response
) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!id) {
    return res.status(400).json({ error: "Product id is required" });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (product) {
      return res.json(product);
    }

    const fallbackProduct = fallbackProducts.find((p) => p.id === id);

    if (fallbackProduct) {
      return res.json(fallbackProduct);
    }

    return res.status(404).json({
      error: "Product not found",
    });
  } catch (error) {
    console.error(error);

    const fallbackProduct = fallbackProducts.find((p) => p.id === id);
    if (fallbackProduct) {
      return res.json(fallbackProduct);
    }

    return res.status(500).json({
      error: "Server error",
    });
  }
}