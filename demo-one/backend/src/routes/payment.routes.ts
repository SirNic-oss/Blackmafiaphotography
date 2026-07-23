import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  getPayments,
  getPaymentByOrderNumber,
  uploadProofOfPayment,
  approvePayment,
  rejectPayment,
  requestNewProof,
  confirmPaymentMade,
} from "../controllers/payment.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

const paymentsDir = "uploads/payments";
if (!fs.existsSync(paymentsDir)) {
  fs.mkdirSync(paymentsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, paymentsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".pdf", ".png", ".jpg", ".jpeg"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, PNG, and JPEG files are allowed."));
    }
  },
});

router.get("/", authMiddleware, adminMiddleware, getPayments);
router.get("/order/:orderNumber", getPaymentByOrderNumber);
router.post(
  "/order/:orderNumber/proof",
  upload.single("proof"),
  uploadProofOfPayment
);
router.post("/order/:orderNumber/confirm", confirmPaymentMade);
router.patch("/:id/approve", authMiddleware, adminMiddleware, approvePayment);
router.patch("/:id/reject", authMiddleware, adminMiddleware, rejectPayment);
router.patch("/:id/request-proof", authMiddleware, adminMiddleware, requestNewProof);

export default router;
