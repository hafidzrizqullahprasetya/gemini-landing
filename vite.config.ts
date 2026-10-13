import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { app as octaneApp } from "./server/index";

const octaneApiPlugin = (): Plugin => ({
  name: "octane-api-middleware",
  apply: "serve",
  configureServer(server) {
    server.middlewares.use(octaneApp);
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), octaneApiPlugin()],
  resolve: {
    alias: [
      { find: /^@\/lib\/(.*)$/, replacement: path.resolve(__dirname, "./lib/$1") },
      { find: /^@\/services\/(.*)$/, replacement: path.resolve(__dirname, "./src/services/$1") },
      { find: /^@\/data\/(.*)$/, replacement: path.resolve(__dirname, "./src/data/$1") },
      { find: "@", replacement: path.resolve(__dirname, ".") },
    ],
  },
  server: {
    port: 5173,
    proxy: {
      "/api/reseller": {
        target: "https://ventetelegrambotrailway-production.up.railway.app",
        changeOrigin: true,
        headers: {
          "X-Reseller-Key": process.env.VENTE_API_KEY || "",
        },
      },
    },
  },
});
