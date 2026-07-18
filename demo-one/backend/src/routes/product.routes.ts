import { Router } from "express";
import { getProducts,getProductById } from "../controllers/product.controller";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", async (_req, res) => {
  res.json({
    success: true,
  });
});

export default router;
