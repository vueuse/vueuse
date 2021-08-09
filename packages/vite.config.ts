import { resolve } from 'path'
import { UserConfig } from 'vite'
import Icons, { ViteIconsResolver } from 'vite-plugin-icons'
import Components from 'vite-plugin-components'
import { VitePWA } from 'vite-plugin-pwa'
import WindiCSS from 'vite-plugin-windicss'
import { functionNames, getFunction } from '../meta/function-indexes'
import { getFunctionHead, hasDemo } from '../scripts/utils'

const config: UserConfig = {
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
      '@vueuse/shared',
      '@vueuse/core',
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
  server: {
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    Components({
      dirs: [
        '.vitepress/theme/components',
      ],
      customLoaderMatcher: id => id.endsWith('.md'),
      customComponentResolvers: [
        ViteIconsResolver({
          componentPrefix: '',
        }),
      ],
    }),
    Icons(),
    {
      name: 'vueuse-md-transform',
      enforce: 'pre',
      transform(code, id) {
        if (!id.endsWith('.md'))
          return null

        // linkify function names
        code = code.replace(
          new RegExp(`\`({${functionNames.join('|')}})\`(.)`, 'g'),
          (_, name, ending) => {
            if (ending === ']') // already a link
              return _
            const fn = getFunction(name)!
            return `[\`${fn.name}\`](${fn.docs})`
          },
        )
        // convert links to relative
        code = code.replace(/https?:\/\/vueuse\.org\//g, '/')

        const [pkg, name, i] = id.split('/').slice(-3)

        if (functionNames.includes(name) && i === 'index.md') {
          const frontmatterEnds = code.indexOf('---\n\n') + 4
          let header = ''
          if (hasDemo(pkg, name))
            header = '\n<script setup>\nimport Demo from \'./demo.vue\'\n</script>\n<DemoContainer><Demo/></DemoContainer>\n'

          header += getFunctionHead(pkg, name)

          if (header)
            code = code.slice(0, frontmatterEnds) + header + code.slice(frontmatterEnds)
        }

        return code
      },
    },
    VitePWA({
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
  ],
}

export default config
