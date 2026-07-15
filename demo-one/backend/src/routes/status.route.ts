import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Fashion Fit Backend</title>
        <style>
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #111827;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }

          .card {
            background: #1f2937;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 500px;
          }

          h1 {
            color: #22c55e;
            margin-bottom: 10px;
          }

          p {
            color: #d1d5db;
            margin: 8px 0;
          }

          .badge {
            display: inline-block;
            margin-top: 20px;
            padding: 8px 16px;
            background: #22c55e;
            color: white;
            border-radius: 999px;
            font-weight: bold;
          }
        </style>
      </head>

      <body>
        <div class="card">
          <h1>👟 Fashion Fit Backend</h1>

          <p>Your backend server is running successfully.</p>

          <p>API Status: Online</p>

          <div class="badge">Healthy</div>
        </div>
      </body>
    </html>
  `);
});

export default router;