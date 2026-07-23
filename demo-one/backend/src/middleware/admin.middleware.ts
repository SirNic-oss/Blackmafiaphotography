import { Request, Response, NextFunction } from "express";

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as { role?: "ADMIN" | "USER" } | undefined;

  if (user?.role === "ADMIN") {
    next(); 
  } else {
    res.status(403).json({ error: "Forbidden: Admins only" });
  }
};
