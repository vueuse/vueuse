import Vue from '@vitejs/plugin-vue2'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    Vue(),
  ],
  build: {
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('/node_modules/@vueuse/'))
            return 'vueuse'
          else
            return 'vendor'
        },
      },
    },
  },
})
