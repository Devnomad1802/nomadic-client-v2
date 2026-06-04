import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      // PNG — lossless compression + convert to WebP
      png: {
        quality: 85,
      },
      // JPEG — lossy compression
      jpg: {
        quality: 82,
      },
      jpeg: {
        quality: 82,
      },
      // WebP output — best compression for web
      webp: {
        lossless: false,
        quality: 82,
        alphaQuality: 85,
        force: false,
      },
      // Skip already-optimised tiny files (<2KB)
      exclude: /\.(svg|gif)$/,
      logStats: true,
    }),
  ],
})
