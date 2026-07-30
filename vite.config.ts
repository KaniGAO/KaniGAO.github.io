import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // three.js / echarts are heavy and change rarely — split them into their
    // own long-cacheable vendor chunks. The WebGL scene is also lazy-loaded
    // (see Home.tsx), so it only downloads after first paint.
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('three') || id.includes('@react-three')) return 'three'
          if (id.includes('echarts') || id.includes('zrender')) return 'echarts'
          if (
            id.includes('/react/') ||
            id.includes('react-dom') ||
            id.includes('scheduler')
          )
            return 'react-vendor'
          return 'vendor'
        },
      },
    },
  },
})
