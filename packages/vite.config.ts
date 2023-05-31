import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import { VitePWA as PWA } from 'vite-plugin-pwa'
import UnoCSS from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
import { getChangeLog, getFunctionContributors } from '../scripts/changelog'
import { MarkdownTransform } from './.vitepress/plugins/markdownTransform'
import { ChangeLog } from './.vitepress/plugins/changelog'
import { Contributors } from './.vitepress/plugins/contributors'

export default defineConfig(async () => {
  const [changeLog, contributions] = await Promise.all([
    getChangeLog(process.env.CI ? 1000 : 100),
    getFunctionContributors(),
  ])

  return {
    server: {
      hmr: {
        overlay: false,
      },
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
        dirs: resolve(__dirname, '.vitepress/theme/components'),
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [
          IconsResolver({
            componentPrefix: '',
          }),
        ],
        dts: './.vitepress/components.d.ts',
        transformer: 'vue3',
      }),
      Icons({
        compiler: 'vue3',
        defaultStyle: 'display: inline-block',
      }),
      PWA({
        outDir: '.vitepress/dist',
        manifest: {
          name: 'VueUse',
          short_name: 'VueUse',
          theme_color: '#ffffff',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
      UnoCSS(),
      Inspect(),
    ],
    resolve: {
      alias: {
        '@vueuse/shared': resolve(__dirname, 'shared/index.ts'),
        '@vueuse/core': resolve(__dirname, 'core/index.ts'),
        '@vueuse/math': resolve(__dirname, 'math/index.ts'),
        '@vueuse/integrations': resolve(__dirname, 'integrations/index.ts'),
        '@vueuse/components': resolve(__dirname, 'components/index.ts'),
        '@vueuse/metadata': resolve(__dirname, 'metadata/index.ts'),
        '@vueuse/docs-utils': resolve(__dirname, '.vitepress/plugins/utils.ts'),
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
  }
})
