import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { coverageConfigDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    vue(),
  ],
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
    env: {
      TZ: 'UTC-1', // to have some actual results with timezone offset
    },
    coverage: {
      exclude: [
        'packages/.vitepress/**',
        'playgrounds/**',
        '**/(unocss,taze).config.ts',
        'scripts/**',
        ...coverageConfigDefaults.exclude,
      ],
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
              // { browser: 'firefox' }, // flaky FF test: https://github.com/vitest-dev/vitest/issues/7377
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
            'test/*.{test,spec}.ts',
          ],
          server: {
            deps: {
              inline: [
                'vue',
                'msw',
                'vitest-package-exports',
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
