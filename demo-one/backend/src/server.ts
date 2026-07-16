import express, { Request, Response } from "express";
import cors, { CorsOptions } from "cors";

import productRoutes from "./routes/product.routes";
import statusRoutes from "./routes/status.route";

const app = express();

const frontendOrigin =
  process.env.FRONTEND_URL || "http://localhost:3000";

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    const isLocalDev = /^http:\/\/localhost:\d+$/.test(origin);

    if (isLocalDev || origin === frontendOrigin) {
      return callback(null, true);
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Fashion Fit Backend Running 🚀",
  });
});

app.use("/status", statusRoutes);

app.use("/api/products", productRoutes);

const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});