import { resolve } from 'node:path'
import process from 'node:process'
import { createRequire } from 'node:module'
import { defineConfig } from 'vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
import { getChangeLog, getFunctionContributors } from '../../scripts/changelog'
import { MarkdownTransform } from './plugins/markdownTransform'
import { ChangeLog } from './plugins/changelog'
import { Contributors } from './plugins/contributors'

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
          componentPrefix: '',
        }),
      ],
      dts: resolve(__dirname, 'components.d.ts'),
      transformer: 'vue3',
    }),
    Icons({
      compiler: 'vue3',
      defaultStyle: 'display: inline-block',
    }),
    UnoCSS(),
    Inspect(),
  ],
  resolve: {
    alias: {
      '@vueuse/shared': resolve(__dirname, '../shared/index.ts'),
      '@vueuse/core': resolve(__dirname, '../core/index.ts'),
      '@vueuse/math': resolve(__dirname, '../math/index.ts'),
      '@vueuse/integrations/useFocusTrap': resolve(__dirname, '../integrations/useFocusTrap/index.ts'),
      '@vueuse/integrations': resolve(__dirname, '../integrations/index.ts'),
      '@vueuse/components': resolve(__dirname, '../components/index.ts'),
      '@vueuse/metadata': resolve(__dirname, '../metadata/index.ts'),
      '@vueuse/docs-utils': resolve(__dirname, 'plugins/utils.ts'),
    },
    dedupe: [
      'vue',
      'vue-demi',
      '@vue/runtime-core',
    ],
  },
  optimizeDeps: {
    exclude: [
      'vue-demi',
      '@vueuse/shared',
      '@vueuse/core',
      'body-scroll-lock',
    ],
    include: [
      'axios',
      'js-yaml',
      'nprogress',
      'qrcode',
      'tslib',
      'fuse.js',
      'universal-cookie',
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('@vueuse/'))
            return 'vueuse'
          if (id.includes('@vue/') || id.includes('/vue/'))
            return 'vue'
        },
      },
    },
  },
  css: {
    postcss: {
      plugins: [
        require('postcss-nested'),
      ],
    },
  },
})
