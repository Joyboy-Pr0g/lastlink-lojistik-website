import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { compression } from "vite-plugin-compression2";

export default defineConfig({
  plugins: [react(), compression({ algorithms: ["brotliCompress"] })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  build: {
    target: "es2020",
    sourcemap: false,
    rollupOptions: {
      // Multi-page build: the legal documents ship as their own HTML entries,
      // so /privacy/ and /terms/ are real URLs on any static host — no SPA
      // rewrite rule needed.
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        privacy: fileURLToPath(new URL("./privacy/index.html", import.meta.url)),
        terms: fileURLToPath(new URL("./terms/index.html", import.meta.url))
      },
      output: {
        manualChunks: (id: string) => {
          if (id.includes("preload-helper")) return "react";
          if (!id.includes("node_modules")) return;
          if (/[\\/]node_modules[\\/](three|@react-three)[\\/]/.test(id)) return "three";
          if (/[\\/]node_modules[\\/]gsap[\\/]/.test(id)) return "gsap";
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return "react";
        }
      }
    }
  }
});
