  import { defineConfig } from "vite";
  import react from "@vitejs/plugin-react";

  // https://vite.dev/config/
  export default defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://54.180.86.163:8080', // ✅ 백엔드 서버 주소로 변경
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'), // 필요 없으면 생략 가능
        },
      },
      historyApiFallback: true,
    },
  });
