import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import { registerRoutes } from "./routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5173;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

// Configure production static files before registering routes
if (process.env.NODE_ENV === "production") {
  const publicPath = path.resolve(__dirname, "../dist/public");
  app.use(express.static(publicPath));
}

// Start the server and register routes
registerRoutes(app).then(server => {
  if (process.env.NODE_ENV === "production") {
    const publicPath = path.resolve(__dirname, "../dist/public");
    app.get("*", (req, res) => {
      if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(publicPath, "index.html"));
      }
    });
  }

  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});