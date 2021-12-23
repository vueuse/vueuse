import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtConfig } from 'nuxt3'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  modules: [
    resolve(__dirname, '../../packages/nuxt/index.ts'),
  ],
  alias: {
    '@vueuse/core': resolve(__dirname, '../../packages/core/index.ts'),
    '@vueuse/shared': resolve(__dirname, '../../packages/shared/index.ts'),
  },
  vueuse: {
    ssrHandlers: true,
  },
})
