import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type ProxyOptions } from "vite";

const apiProxy: Record<string, ProxyOptions> = {
  "/api": {
    target: "https://agsdemo.in",
    changeOrigin: true,
    secure: true,
    rewrite: (path) => path.replace(/^\/api/, "/iplboysapi/public/api"),
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: apiProxy,
  },
  preview: {
    proxy: apiProxy,
  },
});
