import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Correct: enable SPA fallback via middleware, automatically handled by Vite
    // No need for 'historyApiFallback'
  }
});
