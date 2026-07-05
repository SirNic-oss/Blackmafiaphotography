import { Router } from "express";
import { getProducts } from "../controllers/product.controller";

const router = Router();

router.get("/", getProducts);

router.post("/", async (_req, res) => {
  res.json({
    success: true,
  });
});

export default router;
