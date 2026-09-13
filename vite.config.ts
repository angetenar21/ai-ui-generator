import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React — loaded first, cached forever
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // MUI core — large, changes rarely
          'vendor-mui': ['@mui/material', '@emotion/react', '@emotion/styled'],
          // MUI icons — very large, completely separate chunk
          'vendor-mui-icons': ['@mui/icons-material'],
          // MUI X (charts + data grid) — only needed on specific pages
          'vendor-mui-x': ['@mui/x-charts', '@mui/x-data-grid'],
          // Recharts — second charting library
          'vendor-charts': ['recharts'],
          // Firebase SDK — auth + firestore
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // Framer Motion — animation library
          'vendor-motion': ['framer-motion'],
          // Lucide icons
          'vendor-lucide': ['lucide-react'],
        },
      },
    },
    // Warn when any single chunk exceeds 500KB
    chunkSizeWarningLimit: 500,
  },
})
