import express from "express";
import multer from "multer";
import path from "path";
import { getPublicApiUrl } from "../config/env";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No image uploaded",
    });
  }

  res.json({
    imageUrl: `${getPublicApiUrl()}/uploads/products/${req.file.filename}`,
  });
});

export default router;