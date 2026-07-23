import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

// Get all products
router.get("/", getProducts);

// Get single product
router.get("/:id", getProductById);

// Create product
router.post("/", authMiddleware, adminMiddleware, createProduct);

// Update product
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);

// Delete product
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;
