// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // ✅ Keep for Vercel & local serve
  publicDir: 'public',
  server: {
    historyApiFallback: true, // ✅ Required for SPA refresh routing fix
  },
});
