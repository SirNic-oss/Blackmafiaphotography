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
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (product) {
      return res.json(product);
    }

    // If database has no product, search fallback products
    const fallbackProduct = fallbackProducts.find(
      (p) => p.id === req.params.id
    );

    if (fallbackProduct) {
      return res.json(fallbackProduct);
    }

    return res.status(404).json({
      error: "Product not found",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Server error",
    });
  }
}