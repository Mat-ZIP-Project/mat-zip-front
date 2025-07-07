import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // ← 백엔드 포트에 맞게 수정
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"), // /api 그대로 유지
      },
    },
  },
});
