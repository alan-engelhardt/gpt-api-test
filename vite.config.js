import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://kea-alt-del.dk",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/t7/api")
      },
      "/images": {
        target: "https://kea-alt-del.dk",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/images/, "/t7/images")
      }
    }
  }
});
