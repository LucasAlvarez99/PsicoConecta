import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ====================
// Middlewares
// ====================
app.use(cors());
app.use(express.json());

// ====================
// API de ejemplo (acá irán tus rutas reales: auth, pacientes, etc.)
// ====================
app.get("/api/hello", (req, res) => {
  res.json({ message: "API funcionando 🚀" });
});

// ====================
// Configuración para servir el frontend
// ====================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servimos los archivos de Vite ya construidos
app.use(express.static(path.join(__dirname, "../dist")));

// Fallback: cualquier ruta que no sea API devuelve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// ====================
// Inicio del servidor
// ====================
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
