import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { isValidEmail, normalizeEmail } from "../utils/validation";

const prisma = new PrismaClient();

export async function subscribeNewsletter(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ error: "Email is required." });
    }

    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing?.isActive) {
      return res.status(409).json({ error: "This email is already subscribed." });
    }

    if (existing && !existing.isActive) {
      const reactivated = await prisma.newsletterSubscriber.update({
        where: { email: normalizedEmail },
        data: { isActive: true, subscribedAt: new Date() },
      });
      return res.status(200).json({
        message: "Successfully subscribed.",
        subscriber: reactivated,
      });
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email: normalizedEmail },
    });

    return res.status(201).json({
      message: "Successfully subscribed.",
      subscriber,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({ error: "This email is already subscribed." });
    }

    console.error("Newsletter subscribe error:", error);
    return res.status(500).json({ error: "Failed to subscribe. Please try again." });
  }
}

export async function getSubscribers(req: Request, res: Response) {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where: search
          ? { email: { contains: search, mode: "insensitive" } }
          : undefined,
        orderBy: { subscribedAt: "desc" },
      }),
      prisma.newsletterSubscriber.count(),
    ]);

    return res.json({ subscribers, total });
  } catch (error) {
    console.error("Get subscribers error:", error);
    return res.status(500).json({ error: "Failed to fetch subscribers." });
  }
}

export async function deleteSubscriber(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Subscriber ID is required." });
    }

    await prisma.newsletterSubscriber.delete({ where: { id } });

    return res.json({ message: "Subscriber deleted." });
  } catch (error) {
    console.error("Delete subscriber error:", error);
    return res.status(500).json({ error: "Failed to delete subscriber." });
  }
}

export async function exportSubscribers(_req: Request, res: Response) {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: "desc" },
    });

    const header = "Email,Subscribed At,Active\n";
    const rows = subscribers
      .map(
        (s) =>
          `"${s.email}","${s.subscribedAt.toISOString()}","${s.isActive ? "Yes" : "No"}"`
      )
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="newsletter-subscribers.csv"'
    );

    return res.send(header + rows);
  } catch (error) {
    console.error("Export subscribers error:", error);
    return res.status(500).json({ error: "Failed to export subscribers." });
  }
}
