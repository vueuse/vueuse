import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@vueuse/shared': resolve(import.meta.dirname, 'packages/shared/index.ts'),
      '@vueuse/core': resolve(import.meta.dirname, 'packages/core/index.ts'),
      '@vueuse/math': resolve(import.meta.dirname, 'packages/math/index.ts'),
      '@vueuse/components': resolve(import.meta.dirname, 'packages/components/index.ts'),
      '@vueuse/docs-utils': resolve(import.meta.dirname, 'packages/.vitepress/plugins/utils.ts'),
    },
    dedupe: [
      'vue',
      '@vue/runtime-core',
    ],
  },
  define: {
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
  },
  cacheDir: resolve(import.meta.dirname, 'node_modules/.vite'),
  test: {
    reporters: 'dot',
    coverage: {
      exclude: ['./packages/**/demo.vue'],
    },
    clearMocks: true,
    workspace: [
      'packages/*/vitest.config.ts',
      {
        // add "extends: true" to inherit the options from the root config
        extends: './vitest.config.ts',
        resolve: {
          alias: {
            vue: 'vue/dist/vue.esm-bundler.js',
          },
        },
        test: {
          include: ['packages/**/*.browser.{test,spec}.ts'],
          name: 'browser',
          setupFiles: ['vitest-browser-vue'],
          browser: {
            enabled: true,
            provider: 'playwright',
            headless: true,
            instances: [
              { browser: 'chromium' },
              { browser: 'firefox' },
              { browser: 'webkit' },
            ],
          },
        },
      },
      {
        extends: './vitest.config.ts',
        test: {
          name: 'unit',
          environment: 'jsdom',
          setupFiles: [resolve(import.meta.dirname, 'packages/.test/setup.ts')],
          include: [
            '!packages/**/*.browser.{test,spec}.ts',
            'packages/**/*.{test,spec}.ts',
          ],
          server: {
            deps: {
              inline: [
                'vue',
                'msw',
              ],
            },
          },
        },
      },
    ],
  },
  ssr: {
    noExternal: [
      /@vueuse\/.*/,
    ],
  },
})
