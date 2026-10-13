import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
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
          "X-Reseller-Key": "vbr_live_ff7171abf6_rRjj5OPO_uX5knZkdK93q_McT-Whr38J__2UYCtgpp4",
        },
      },
    },
  },
});
