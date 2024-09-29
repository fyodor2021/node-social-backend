import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Icons from 'unplugin-icons/vite'
export default defineConfig({
  plugins: [vue(), Icons()],
  server: {
    port: 3000,
    //   // rewrite: (pathname) => {
    //   //   return pathname.replace(/^\/api/,'')
    //   // }
    // },
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
