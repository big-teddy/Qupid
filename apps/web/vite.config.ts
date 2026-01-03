import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../..", "");
  return {
    envPrefix: ["VITE_", "NEXT_PUBLIC_"], // Compatibility for Next.js legacy env vars
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: [
          "favicon.ico",
          "apple-touch-icon.png",
          "masked-icon.svg",
        ],
        manifest: {
          name: "Qupid - AI 대화 코칭",
          short_name: "Qupid",
          description: "AI 기반 대화 연습 및 코칭 앱",
          theme_color: "#F093B0",
          background_color: "#F9FAFB",
          display: "standalone",
          orientation: "portrait",
          icons: [
            {
              src: "icons/icon-72x72.png",
              sizes: "72x72",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "icons/icon-96x96.png",
              sizes: "96x96",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "icons/icon-128x128.png",
              sizes: "128x128",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "icons/icon-144x144.png",
              sizes: "144x144",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "icons/icon-152x152.png",
              sizes: "152x152",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "icons/icon-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "icons/icon-384x384.png",
              sizes: "384x384",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "icons/icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
          categories: ["education", "lifestyle", "social"],
          lang: "ko",
          screenshots: [
            {
              src: "screenshots/home.png",
              sizes: "1080x1920",
              type: "image/png",
              form_factor: "narrow",
            },
          ],
          shortcuts: [
            {
              name: "새 대화 시작",
              short_name: "대화",
              description: "AI와 대화 연습 시작",
              url: "/chat",
              icons: [{ src: "icons/icon-96x96.png", sizes: "96x96" }],
            },
            {
              name: "코칭 받기",
              short_name: "코칭",
              description: "AI 코치와 상담",
              url: "/coaching",
              icons: [{ src: "icons/icon-96x96.png", sizes: "96x96" }],
            },
          ],
        },
        devOptions: {
          enabled: true,
        },
      }),
    ],
    define: {
      "process.env.OPENAI_API_KEY": JSON.stringify(env.OPENAI_API_KEY),
      "process.env.API_KEY": JSON.stringify(env.OPENAI_API_KEY), // Backward compatibility
      "process.env.SUPABASE_URL": JSON.stringify(env.SUPABASE_URL),
      "process.env.SUPABASE_ANON_KEY": JSON.stringify(env.SUPABASE_ANON_KEY),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@qupid/core": path.resolve(__dirname, "../../packages/core/src"),
        "@qupid/ui": path.resolve(__dirname, "../../packages/ui/src"),
      },
    },
    server: {
      port: 5173,
      host: true,
    },
    build: {
      // 번들 크기 최적화
      target: "es2020",
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: mode === "production", // 프로덕션에서 console 제거
          drop_debugger: true,
        },
      },
      // 청크 크기 경고 임계값 (KB)
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // 코드 스플리팅: 큰 라이브러리들을 별도 청크로 분리
          manualChunks: {
            // React 관련
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            // UI 라이브러리
            "ui-vendor": ["lucide-react", "chart.js"],
            // 데이터 관리
            "data-vendor": ["@tanstack/react-query", "zustand", "axios"],
            // Form 관련
            "form-vendor": ["react-hook-form", "@hookform/resolvers", "zod"],
            // Supabase
            "supabase-vendor": ["@supabase/supabase-js"],
          },
          // 파일명 해싱으로 캐싱 최적화
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        },
      },
      // 소스맵 설정 (프로덕션에서는 비활성화)
      sourcemap: mode !== "production",
    },
    // 의존성 최적화
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "@tanstack/react-query",
      ],
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
    },
  };
});
