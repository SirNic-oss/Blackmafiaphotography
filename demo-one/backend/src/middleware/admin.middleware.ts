import { Request, Response, NextFunction } from "express";

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role === "ADMIN") {
    next(); 
  } else {
    res.status(403).json({ error: "Forbidden: Admins only" });
  }
};