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
}

export default config
