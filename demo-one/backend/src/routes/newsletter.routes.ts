import { Router } from "express";
import {
  subscribeNewsletter,
  getSubscribers,
  deleteSubscriber,
  exportSubscribers,
} from "../controllers/newsletter.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

router.post("/subscribe", subscribeNewsletter);
router.get("/subscribers", authMiddleware, adminMiddleware, getSubscribers);
router.delete("/subscribers/:id", authMiddleware, adminMiddleware, deleteSubscriber);
router.get("/subscribers/export/csv", authMiddleware, adminMiddleware, exportSubscribers);

export default router;
