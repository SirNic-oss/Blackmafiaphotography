import { Request, Response, NextFunction } from "express";

type AuthUser = { id: string; role: "ADMIN" | "USER" };

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as AuthUser | undefined;
  if (user?.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({ error: "Forbidden: Admins only" });
  }
};