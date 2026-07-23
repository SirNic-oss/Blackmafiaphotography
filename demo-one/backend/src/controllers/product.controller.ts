import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { fallbackProducts } from "../data/fallback-products";

const prisma = new PrismaClient();

async function fetchProductsFromDb() {
  try {
    return await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Database fetch failed:", error);
    return null;
  }
}

export async function getProducts(
  _req: Request,
  res: Response
) {
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
  const id = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  if (!id) {
    return res.status(400).json({
      error: "Product ID is required",
    });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (product) {
      return res.json(product);
    }

    const fallback = fallbackProducts.find((p) => p.id === id);

    if (fallback) {
      return res.json(fallback);
    }

    return res.status(404).json({
      error: "Product not found",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to fetch product",
    });
  }
}

export async function createProduct(
  req: Request,
  res: Response
) {
  try {
    const {
      name,
      category,
      description,
      price,
      stock,
      colors,
      sizes,
      images,
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        category,
        description,
        price: Number(price),
        stock: Number(stock),
        colors,
        sizes,
        images,
      },
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to create product",
    });
  }
}

export async function updateProduct(
  req: Request,
  res: Response
) {
  const id = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  if (!id) {
    return res.status(400).json({
      error: "Product ID is required",
    });
  }

  try {
    const {
      name,
      category,
      description,
      price,
      stock,
      colors,
      sizes,
      images,
    } = req.body;

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        category,
        description,
        price: Number(price),
        stock: Number(stock),
        colors,
        sizes,
        images,
      },
    });

    return res.json(product);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to update product",
    });
  }
}

export async function deleteProduct(
  req: Request,
  res: Response
) {
  const id = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  if (!id) {
    return res.status(400).json({
      error: "Product ID is required",
    });
  }

  try {
    await prisma.product.delete({
      where: {
        id,
      },
    });

    return res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to delete product",
    });
  }
}