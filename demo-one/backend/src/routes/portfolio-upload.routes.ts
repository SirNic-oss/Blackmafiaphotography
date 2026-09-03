import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { getPublicApiUrl } from "../config/env";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = express.Router();
const directory = path.resolve("uploads", "portfolio");
fs.mkdirSync(directory, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, directory),
    filename: (_req, file, callback) => callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => callback(null, file.mimetype.startsWith("image/")),
});

router.post("/", authMiddleware, adminMiddleware, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded or file is not an image" });
  return res.status(201).json({ imageUrl: `${getPublicApiUrl()}/uploads/portfolio/${req.file.filename}` });
});

export default router;
