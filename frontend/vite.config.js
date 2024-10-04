import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Icons from "unplugin-icons/vite";
import fs from "fs";
import path from "node:path";
import { trace } from "node:console";
export default defineConfig({
  plugins: [vue(), Icons()],
  server: {
    cors: {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
    },
    https: {
      key: fs.readFileSync("../certs/key.pem"),
      cert: fs.readFileSync("../certs/cert.pem"),
    },
    proxy: {
      "/api/v1": {
        target: "https://josedor.local",
        secure: false,
        changeOrigin: false,
      },
      '/socket.io': {
        target: 'https://josedor.local',
        secure: false,
        changeOrigin: false,
        ws: true
      }
    },
    port: '8080',
    host: '0.0.0.0',
    watch: {
      usePolling: true,
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
