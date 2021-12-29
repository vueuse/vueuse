import { resolve } from 'path'
import { defineConfig } from 'vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import { VitePWA as PWA } from 'vite-plugin-pwa'
import WindiCSS from 'vite-plugin-windicss'
import Inspect from 'vite-plugin-inspect'
import { MarkdownTransform } from './.vitepress/markdownTransform'
import { ChangeLog } from './.vitepress/changelog'
import { Contributors } from './.vitepress/contributors'

export default defineConfig({
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
    ChangeLog(),
    Contributors(),
    // TODO: remove this
    {
      name: 'emmm',
      configResolved(config) {
        const index = config.plugins.findIndex(i => i.name === 'vite:ssr-require-hook')
        if (index > -1)
          // @ts-expect-error
          config.plugins.splice(index, 1)
      },
    },

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
    WindiCSS({
      preflight: false,
    }),
    Inspect(),
  ],
  resolve: {
    alias: {
      '@vueuse/shared': resolve(__dirname, 'shared/index.ts'),
      '@vueuse/core': resolve(__dirname, 'core/index.ts'),
      '@vueuse/components': resolve(__dirname, 'components/index.ts'),
      '@vueuse/docs-utils': resolve(__dirname, '.vitepress/utils.ts'),
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
      '@vue/theme',
      '@vueuse/shared',
      '@vueuse/core',
      'body-scroll-lock',
    ],
    include: [
      'axios',
      'dayjs',
      'js-yaml',
      'nprogress',
      'qrcode',
      'rxjs',
      'tslib',
      'universal-cookie',
    ],
  },
})
