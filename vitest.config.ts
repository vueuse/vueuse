import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

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
    exclude: [
      '**/node_modules/**',
    ],
    coverage: {
      include: [
        'packages/**/*.ts',
      ],
      exclude: [
        'packages/.vitepress/**',
        'packages/metadata/**',
        'packages/components/**',
        'packages/nuxt/**',
        'packages/contributors.ts',
        '**/_template/**',
        '**/.test/**',
        '**/.turbo/**',
        '**/demo/**',
        '**/dist/**',
        '**/node_modules/**',
        '**/*.test.ts',
        '**/*.*.test.ts',
        '**/types.ts',
        '**/_types.ts',
        '**/*.config.ts',
      ],
    },

    clearMocks: true,
    projects: [
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
            provider: playwright(),
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
          include: ['packages/**/*.server.{test,spec}.ts'],
          name: 'server',
          environment: 'node',
        },
      },
      {
        extends: './vitest.config.ts',
        test: {
          name: 'unit',
          environment: 'jsdom',
          setupFiles: [resolve(import.meta.dirname, 'packages/.test/setup.ts')],
          include: [
            'packages/**/*.{test,spec}.ts',
            'test/*.{test,spec}.ts',
          ],
          exclude: [
            'packages/**/*.{browser,server}.{test,spec}.ts',
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
