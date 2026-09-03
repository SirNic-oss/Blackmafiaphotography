import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
const value = (item: unknown) => typeof item === "string" ? item.trim() : "";

export async function listPortfolio(_req: Request, res: Response) {
  const items = await prisma.portfolioItem.findMany({ where: { published: true }, orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }] });
  res.json({ items });
}

export async function listAdminPortfolio(_req: Request, res: Response) {
  const items = await prisma.portfolioItem.findMany({ orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }] });
  res.json({ items });
}

export async function createPortfolioItem(req: Request, res: Response) {
  const title = value(req.body.title), category = value(req.body.category), imageUrl = value(req.body.imageUrl);
  if (!title || !category || !imageUrl) return res.status(400).json({ error: "Title, category and image are required" });
  const item = await prisma.portfolioItem.create({ data: { title, category, imageUrl, altText: value(req.body.altText) || null, description: value(req.body.description) || null, displayOrder: Number(req.body.displayOrder) || 0, published: req.body.published !== false } });
  res.status(201).json({ item });
}

export async function updatePortfolioItem(req: Request, res: Response) {
  const id = typeof req.params.id === "string" ? req.params.id : req.params.id[0];
  if (!id) return res.status(400).json({ error: "Portfolio item ID is required" });
  try {
    const item = await prisma.portfolioItem.update({ where: { id }, data: {
      ...(typeof req.body.title === "string" ? { title: value(req.body.title) } : {}),
      ...(typeof req.body.category === "string" ? { category: value(req.body.category) } : {}),
      ...(typeof req.body.imageUrl === "string" ? { imageUrl: value(req.body.imageUrl) } : {}),
      ...(typeof req.body.altText === "string" ? { altText: value(req.body.altText) || null } : {}),
      ...(typeof req.body.description === "string" ? { description: value(req.body.description) || null } : {}),
      ...(typeof req.body.displayOrder !== "undefined" ? { displayOrder: Number(req.body.displayOrder) || 0 } : {}),
      ...(typeof req.body.published === "boolean" ? { published: req.body.published } : {}),
    } });
    res.json({ item });
  } catch { res.status(404).json({ error: "Portfolio item not found" }); }
}

export async function deletePortfolioItem(req: Request, res: Response) {
  const id = typeof req.params.id === "string" ? req.params.id : req.params.id[0];
  try { await prisma.portfolioItem.delete({ where: { id } }); res.json({ success: true }); }
  catch { res.status(404).json({ error: "Portfolio item not found" }); }
}
