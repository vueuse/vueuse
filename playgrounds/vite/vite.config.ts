import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    Vue(),
  ],
  resolve: {
    alias: {
      '@vueuse/core': resolve(__dirname, '../../packages/core/index.ts'),
      '@vueuse/shared': resolve(__dirname, '../../packages/shared/index.ts'),
    },
  },
})
