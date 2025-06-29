import { defineConfig } from 'vite'; 
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './', // ✅ ensures assets and styles load correctly on Vercel
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
