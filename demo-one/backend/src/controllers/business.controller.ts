import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
const id = (req: Request) => typeof req.params.id === "string" ? req.params.id : req.params.id[0];

const defaultSiteSettings = () => ({
  id: "default",
  businessName: "Lumen Studio",
  email: "hello@lumenstudio.com",
  phone: "+27 82 000 0000",
  location: "Johannesburg, South Africa",
  instagram: "https://instagram.com/lumenstudio",
  facebook: null,
  pinterest: null,
  about: "Natural light photography for portraits, couples, and families.",
  updatedAt: new Date(),
});

export async function adminServices(_req: Request, res: Response) { res.json({ services: await prisma.photographyService.findMany({ orderBy: [{ displayOrder: "asc" }, { name: "asc" }] }) }); }
export async function createService(req: Request, res: Response) {
  const name = text(req.body.name), description = text(req.body.description); const durationMinutes = Number(req.body.durationMinutes); const price = req.body.price === "" || req.body.price == null ? null : Number(req.body.price);
  if (!name || !description || !Number.isInteger(durationMinutes) || durationMinutes <= 0 || (price !== null && !Number.isFinite(price))) return res.status(400).json({ error: "Name, description, valid duration and price are required" });
  try { const service = await prisma.photographyService.create({ data: { name, description, durationMinutes, price, displayOrder: Number(req.body.displayOrder) || 0, active: req.body.active !== false } }); res.status(201).json({ service }); }
  catch { res.status(409).json({ error: "A service with that name already exists" }); }
}
export async function updateService(req: Request, res: Response) {
  try { const service = await prisma.photographyService.update({ where: { id: id(req) }, data: {
    ...(typeof req.body.name === "string" ? { name: text(req.body.name) } : {}), ...(typeof req.body.description === "string" ? { description: text(req.body.description) } : {}),
    ...(typeof req.body.durationMinutes !== "undefined" ? { durationMinutes: Number(req.body.durationMinutes) } : {}), ...(typeof req.body.price !== "undefined" ? { price: req.body.price === "" || req.body.price === null ? null : Number(req.body.price) } : {}),
    ...(typeof req.body.displayOrder !== "undefined" ? { displayOrder: Number(req.body.displayOrder) || 0 } : {}), ...(typeof req.body.active === "boolean" ? { active: req.body.active } : {}),
  } }); res.json({ service }); } catch { res.status(404).json({ error: "Service not found" }); }
}
export async function deactivateService(req: Request, res: Response) { try { const service = await prisma.photographyService.update({ where: { id: id(req) }, data: { active: false } }); res.json({ service }); } catch { res.status(404).json({ error: "Service not found" }); } }

export async function adminCustomers(_req: Request, res: Response) { res.json({ customers: await prisma.customer.findMany({ include: { bookings: { include: { service: true }, orderBy: { startAt: "desc" } } }, orderBy: { createdAt: "desc" } }) }); }

export async function listTestimonials(_req: Request, res: Response) {
  try {
    res.json({ testimonials: await prisma.testimonial.findMany({ where: { published: true }, orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }] }) });
  } catch (error) {
    console.error("listTestimonials:", error);
    res.json({ testimonials: [] });
  }
}
export async function adminTestimonials(_req: Request, res: Response) { res.json({ testimonials: await prisma.testimonial.findMany({ orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }] }) }); }
export async function createTestimonial(req: Request, res: Response) { const clientName = text(req.body.clientName), quote = text(req.body.quote); if (!clientName || !quote) return res.status(400).json({ error: "Client name and quote are required" }); const testimonial = await prisma.testimonial.create({ data: { clientName, quote, rating: Math.min(5, Math.max(1, Number(req.body.rating) || 5)), category: text(req.body.category) || null, displayOrder: Number(req.body.displayOrder) || 0, published: req.body.published !== false } }); res.status(201).json({ testimonial }); }
export async function updateTestimonial(req: Request, res: Response) { try { const testimonial = await prisma.testimonial.update({ where: { id: id(req) }, data: { ...(typeof req.body.clientName === "string" ? { clientName: text(req.body.clientName) } : {}), ...(typeof req.body.quote === "string" ? { quote: text(req.body.quote) } : {}), ...(typeof req.body.rating !== "undefined" ? { rating: Math.min(5, Math.max(1, Number(req.body.rating) || 5)) } : {}), ...(typeof req.body.category === "string" ? { category: text(req.body.category) || null } : {}), ...(typeof req.body.published === "boolean" ? { published: req.body.published } : {}) } }); res.json({ testimonial }); } catch { res.status(404).json({ error: "Testimonial not found" }); } }
export async function deleteTestimonial(req: Request, res: Response) { try { await prisma.testimonial.delete({ where: { id: id(req) } }); res.json({ success: true }); } catch { res.status(404).json({ error: "Testimonial not found" }); } }

export async function getSiteSettings(_req: Request, res: Response) {
  try {
    let settings = await prisma.siteSetting.findFirst();
    if (!settings) settings = await prisma.siteSetting.create({ data: {} });
    res.json({ settings });
  } catch (error) {
    console.error("getSiteSettings:", error);
    res.json({ settings: defaultSiteSettings() });
  }
}
export async function updateSiteSettings(req: Request, res: Response) { const current = await prisma.siteSetting.findFirst(); const data = { businessName: text(req.body.businessName) || "Lumen Studio", email: text(req.body.email) || null, phone: text(req.body.phone) || null, location: text(req.body.location) || null, instagram: text(req.body.instagram) || null, facebook: text(req.body.facebook) || null, pinterest: text(req.body.pinterest) || null, about: text(req.body.about) || null }; const settings = current ? await prisma.siteSetting.update({ where: { id: current.id }, data }) : await prisma.siteSetting.create({ data }); res.json({ settings }); }
