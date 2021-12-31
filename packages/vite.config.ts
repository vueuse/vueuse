import { join, resolve } from 'path'
import type { Plugin, UserConfig } from 'vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import { VitePWA } from 'vite-plugin-pwa'
import WindiCSS from 'vite-plugin-windicss'
import fs from 'fs-extra'
import { functionNames, getFunction } from '../meta/function-indexes'
import { getFunctionFooter, getFunctionHead, replacer } from '../scripts/utils'

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

    Components({
      dirs: [
        '.vitepress/theme/components',
      ],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        IconsResolver({
          componentPrefix: '',
        }),
      ],
      transformer: 'vue3',
    }),
    Icons({
      compiler: 'vue3',
    }),
    MarkdownTransform(),
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

function MarkdownTransform(): Plugin {
  const DIR_TYPES = resolve(__dirname, '../types/packages')
  const DIR_SRC = resolve(__dirname, '../packages')

  const hasTypes = fs.existsSync(DIR_TYPES)

  if (!hasTypes)
    console.warn('No types dist found, run `npm run build:types` first.')

  return {
    name: 'vueuse-md-transform',
    enforce: 'pre',
    async transform(code, id) {
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
        const hasDemo = fs.existsSync(join(DIR_SRC, pkg, name, 'demo.vue'))

        if (hasTypes)
          code = replacer(code, await getFunctionFooter(pkg, name), 'FOOTER', 'tail')

        const frontmatterEnds = code.indexOf('---\n\n') + 4
        let header = ''
        if (hasDemo)
          header = '\n<script setup>\nimport Demo from \'./demo.vue\'\n</script>\n<DemoContainer><Demo/></DemoContainer>\n'

        header += getFunctionHead(pkg, name)

        if (header)
          code = code.slice(0, frontmatterEnds) + header + code.slice(frontmatterEnds)
      }

      return code
    },
  }
}

export default config
