import { resolve } from 'node:path'
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
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
          // { browser: 'webkit' },
        ],
      },
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'unit',
      environment: 'jsdom',
      setupFiles: [resolve(__dirname, 'packages/.test/setup.ts')],
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
])
