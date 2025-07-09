import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Important for Vercel and local serve!
  publicDir: 'public', // ✅ Ensure public folder is used for static assets like car-start.mp3
});
