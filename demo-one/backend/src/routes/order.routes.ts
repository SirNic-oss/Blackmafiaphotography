import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrderByNumber,
  updateOrderStatus,
  updateShipmentStatus,
} from "../controllers/order.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

router.post("/", createOrder);
router.get("/", authMiddleware, adminMiddleware, getOrders);
router.get("/track/:orderNumber", getOrderByNumber);
router.get("/:orderNumber", getOrderByNumber);
router.patch("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);
router.patch("/:id/shipment", authMiddleware, adminMiddleware, updateShipmentStatus);

export default router;
