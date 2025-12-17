import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import UnoCSS from 'unocss/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import { getChangeLog, getFunctionContributors } from '../../scripts/changelog'
import { ChangeLog } from './plugins/changelog'
import { Contributors } from './plugins/contributors'
import { MarkdownTransform } from './plugins/markdownTransform'
import { PWAVirtual } from './plugins/pwa-virtual'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const require = createRequire(import.meta.url)
const [changeLog, contributions] = await Promise.all([
  getChangeLog(process.env.CI ? 1000 : 100),
  getFunctionContributors(),
])

export default defineConfig({
  server: {
    fs: {
      allow: [
        resolve(__dirname, '..'),
      ],
    },
  },
  plugins: [
    // custom
    MarkdownTransform(),
    ChangeLog(changeLog),
    Contributors(contributions),

    // plugins
    Components({
      dirs: resolve(__dirname, 'theme/components'),
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        IconsResolver({
          prefix: '',
        }),
      ],
      dts: resolve(__dirname, 'components.d.mts'),
      transformer: 'vue3',
    }),
    Icons({
      compiler: 'vue3',
      defaultStyle: 'display: inline-block',
    }),
    UnoCSS(),
    PWAVirtual(),
    Inspect(),
  ],
  resolve: {
    tsconfigPaths: true,
    dedupe: [
      'vue',
      '@vue/runtime-core',
    ],
  },
  optimizeDeps: {
    noDiscovery: true,
  },
  build: {
    rolldownOptions: {
      output: {
        advancedChunks: {
          groups: [
            {
              name(id) {
                if (id.includes('@vueuse/'))
                  return 'vueuse'
                if (id.includes('@vue/') || id.includes('/vue/'))
                  return 'vue'
              },
            },
          ],
        },
      },
      /* TODO: unsupported options for Rolldown */
      // maxParallelFileOps: 5,
    },
    sourcemap: false,
  },
  css: {
    postcss: {
      plugins: [
        require('postcss-nested'),
      ],
    },
  },
  ssr: {
    noExternal: [
      '@vue/repl',
    ],
  },
})
