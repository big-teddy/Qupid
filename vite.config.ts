import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'ai-vendor': ['@google/genai'],
          'ui-vendor': ['chart.js'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Production에서는 sourcemap 비활성화
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@supabase/supabase-js', '@google/genai'],
  },
})
