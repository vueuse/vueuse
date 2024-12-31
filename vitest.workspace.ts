import { resolve } from 'node:path'
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  // If you want to keep running your existing tests in Node.js, uncomment the next line.
  // 'vitest.config.ts',
  {
    extends: 'vitest.config.ts',
    test: {
      include: [
        'packages/**/*.browser.{test,spec}.ts',
      ],
      name: 'browser',
      setupFiles: ['vitest-browser-vue'],
      browser: {
        enabled: true,
        name: 'chromium',
        provider: 'playwright',
        headless: true,
        // https://playwright.dev
        providerOptions: {
        },
      },
    },
    resolve: {
      alias: {
        vue: 'vue/dist/vue.esm-bundler.js',
      },
    },
  },
  {
    extends: 'vitest.config.ts',
    test: {
      name: 'unit',
      environment: 'jsdom',
      include: [
        '!packages/**/*.browser.{test,spec}.ts',
        'packages/**/*.{test,spec}.ts',
      ],
      setupFiles: [resolve(__dirname, 'packages/.test/setup.ts')],
      server: {
        deps: {
          inline: [
            'vue',
            'msw',
          ],
        },
      },
    },
    ssr: {
      noExternal: [
        /@vueuse\/.*/,
      ],
    },
  },
])
