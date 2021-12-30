/* eslint-disable spaced-comment */
/// <reference types="vitest" />
/// <reference types="vitest/global" />

import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@vueuse/shared': resolve(__dirname, 'packages/shared/index.ts'),
      '@vueuse/core': resolve(__dirname, 'packages/core/index.ts'),
      '@vueuse/components': resolve(__dirname, 'packages/components/index.ts'),
      '@vueuse/docs-utils': resolve(__dirname, 'packages/.vitepress/utils.ts'),
    },
    dedupe: [
      'vue',
      'vue-demi',
      '@vue/runtime-core',
    ],
  },
  define: {
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
  },
  test: {
    global: true,
    environment: 'jsdom',
    setupFiles: [resolve(__dirname, 'packages/.test/setup.ts')],
    reporters: 'dot',
  },
})
