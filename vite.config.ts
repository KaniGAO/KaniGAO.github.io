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
          // three + its dependents MUST live in the SAME chunk. Packages like
          // three-stdlib / gainmap define `class X extends Loader` at top level,
          // where `Loader` is imported from three. Splitting them into separate
          // chunks breaks module init order and throws
          // "Cannot access 'Loader' before initialization" (TDZ) at runtime.
          if (
            id.includes('three') ||
            id.includes('@react-three') ||
            id.includes('three-stdlib') ||
            id.includes('gainmap') ||
            id.includes('maath')
          )
            return 'three'
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
