
import express from "express";
import cors from "cors";
import productRoutes from "./routes/product.routes";

const app = express();

const frontendOrigin =
  process.env.FRONTEND_URL || "http://localhost:3000";

app.use(
  cors({
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
  })
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Demo One Backend Running" });
});

app.use("/api/products", productRoutes);

const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
