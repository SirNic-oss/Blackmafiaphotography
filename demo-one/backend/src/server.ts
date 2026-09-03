import express, { Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import path from "path";

import uploadRoutes from "./routes/upload.routes";
import productRoutes from "./routes/product.routes";
import statusRoutes from "./routes/status.route";
import bookingRoutes from "./routes/booking.routes";
import authRoutes from "./routes/api/auth.routes";
import portfolioRoutes from "./routes/portfolio.routes";
import businessRoutes from "./routes/business.routes";
import portfolioUploadRoutes from "./routes/portfolio-upload.routes";
import { getAllowedOrigins } from "./config/env";

const app = express();

const allowedOrigins = getAllowedOrigins();

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
app.use("/api/uploads/portfolio", portfolioUploadRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "FBlack mafia Backend Running 🚀",
  });
});

app.use("/status", statusRoutes);

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", bookingRoutes);
app.use("/api", portfolioRoutes);
app.use("/api", businessRoutes);

console.log("Current __dirname:", __dirname);
console.log("Uploads path:", path.join(__dirname, "../uploads"));

const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
