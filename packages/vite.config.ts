import { resolve } from 'path'
import { UserConfig } from 'vite'

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
