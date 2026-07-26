import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "dev-access-secret";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  console.log("Authorization header:", authorization);

  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;

  if (!token) {
    console.log("No token received");
    return res.status(401).json({ error: "Unauthorized - No token" });
  }

  try {
    const payload = jwt.verify(token, JWT_ACCESS_SECRET) as { userId?: string };

    console.log("JWT payload:", payload);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true },
    });

    console.log("Database user:", user);

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ error: "Unauthorized - User not found" });
    }

    req.user = user;

    console.log("Authentication successful");

    next();
  } catch (err) {
    console.log("JWT verification failed:", err);
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};