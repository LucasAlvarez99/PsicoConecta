import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "client", "src"),
      "@shared": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "shared"),
      "@assets": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "attached_assets"),
    },
  },
  root: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "client"),
  build: {
    outDir: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "dist", "public"),
    emptyOutDir: true,
  },
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:5173',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'ws://localhost:5173',
        ws: true,
      },
    },
    fs: {
      strict: false,
      deny: ["**/.*"],
    },
  },
}));
