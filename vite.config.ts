import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Correct: enable SPA fallback via middleware, automatically handled by Vite
    // No need for 'historyApiFallback'
  },
  build: {
    // Optimize chunk splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react', 'react-icons'],
          'utils-vendor': ['date-fns', 'dayjs', 'clsx'],
          'charts-vendor': ['recharts'],
          'pdf-vendor': ['jspdf', 'jspdf-autotable', 'html2canvas'],
          'supabase-vendor': ['@supabase/supabase-js', '@supabase/auth-helpers-react'],
          'i18n-vendor': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
        },
      },
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging
    sourcemap: false,
    // Optimize CSS
    cssCodeSplit: true,
    // Minify options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'react-icons',
      '@supabase/supabase-js',
      'i18next',
      'react-i18next',
    ],
  },
  // Define global constants
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
});
