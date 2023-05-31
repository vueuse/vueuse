import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

export default defineConfig(({ command }) => ({
  plugins: [
    Vue(),
  ],
  resolve: command === 'build'
    ? {}
    : {
        alias: {
          '@vueuse/core': resolve(__dirname, '../../packages/core/index.ts'),
          '@vueuse/shared': resolve(__dirname, '../../packages/shared/index.ts'),
        },
      },
  build: {
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('@vueuse/'))
            return 'vueuse'
          else
            return 'vendor'
        },
      },
    },
  },
}))
