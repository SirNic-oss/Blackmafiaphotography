import { Router } from "express";
import { adminMiddleware } from "../middleware/admin.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { createPortfolioItem, deletePortfolioItem, listAdminPortfolio, listPortfolio, updatePortfolioItem } from "../controllers/portfolio.controller";

const router = Router();
router.get("/portfolio", listPortfolio);
router.get("/admin/portfolio", authMiddleware, adminMiddleware, listAdminPortfolio);
router.post("/admin/portfolio", authMiddleware, adminMiddleware, createPortfolioItem);
router.patch("/admin/portfolio/:id", authMiddleware, adminMiddleware, updatePortfolioItem);
router.delete("/admin/portfolio/:id", authMiddleware, adminMiddleware, deletePortfolioItem);
export default router;
