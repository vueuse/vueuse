import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@vueuse/shared': resolve(__dirname, 'packages/shared/index.ts'),
      '@vueuse/core': resolve(__dirname, 'packages/core/index.ts'),
      '@vueuse/math': resolve(__dirname, 'packages/math/index.ts'),
      '@vueuse/components': resolve(__dirname, 'packages/components/index.ts'),
      '@vueuse/docs-utils': resolve(__dirname, 'packages/.vitepress/plugins/utils.ts'),
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
  test: {
    setupFiles: [resolve(__dirname, 'packages/.test/setup.ts')],
    workspace: [
      // matches every folder and file inside the `packages` folder
      'packages/*/vitest.config.ts',
      {
        // add "extends: true" to inherit the options from the root config
        extends: true,
        test: {
          alias: {
            vue: 'vue/dist/vue.esm-bundler.js',
          },
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
              // { browser: 'webkit' },
            ],
          },
        },
      },
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
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
})
