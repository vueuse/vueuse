import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  modules: [
    resolve(__dirname, '../../packages/nuxt/index.ts'),
  ],
  alias: {
    '@vueuse/core': resolve(__dirname, '../../packages/core/index.ts'),
    '@vueuse/shared': resolve(__dirname, '../../packages/shared/index.ts'),
    '@vueuse/math': resolve(__dirname, '../../packages/math/index.ts'),
    '@vueuse/integrations': resolve(__dirname, '../../packages/integrations/index.ts'),
  },
  vueuse: {
    ssrHandlers: true,
  },
})
