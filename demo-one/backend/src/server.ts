import express, { Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import path from "path";

import uploadRoutes from "./routes/upload.routes";
import productRoutes from "./routes/product.routes";
import statusRoutes from "./routes/status.route";
import newsletterRoutes from "./routes/newsletter.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/payment.routes";
import authRoutes from "./routes/api/auth.routes";

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || "https://fashion-fit-ruddy.vercel.app",
  process.env.ADMIN_FRONTEND_URL ||
    "https://fashion-fit-admin-dashboard.vercel.app",
];

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    const isLocalDev = /^http:\/\/localhost:\d+$/.test(origin);

    if (isLocalDev || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/api/uploads/products", uploadRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Fashion Fit Backend Running 🚀",
  });
});

app.use("/status", statusRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/newsletter", newsletterRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
