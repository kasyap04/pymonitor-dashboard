import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@':    path.resolve(__dirname, 'src'),
      '@css': path.resolve(__dirname, 'src/assets/css'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/collector': {
        target:      'http://localhost:8888',
        rewrite:     p => p.replace(/^\/collector/, ''),
        changeOrigin: true,
      },
    },
  },
})
