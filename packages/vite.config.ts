import { resolve } from 'path'
import { UserConfig } from 'vite'
import Icons, { ViteIconsResolver } from 'vite-plugin-icons'
import Components from 'vite-plugin-components'

const config: UserConfig = {
  alias: {
    '@vueuse/shared': resolve(__dirname, 'shared'),
  },
  optimizeDeps: {
    exclude: [
      'vue-demi',
    ],
    include: [
      'qrcode',
      'nprogress',
      'tslib',
      'js-yaml',
      'universal-cookie',
      // 'firebase',
      'rxjs',
      'axios',
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
        // resolve(__dirname, '.vitepress/theme/components'),
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

        return code.replace(/https?:\/\/vueuse\.js\.org\//g, '/')
      },
    },
  ],
}

export default config
