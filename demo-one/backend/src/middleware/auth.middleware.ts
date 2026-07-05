import { Request, Response, NextFunction } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Example: Check if user is authenticated by verifying a session or token
  if (req.headers.authorization) {
    // In a real app, verify the token or session here
    // For demo purposes, let's assume it's valid and we extract a user object
    req.user = { id: "sampleUserId" }; // This would be extracted from the token or session
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};