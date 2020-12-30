import { UserConfig } from 'vite'

const config: UserConfig = {
  optimizeDeps: {
    include: [
      'vue-demi',
      'qrcode',
      'nprogress',
      'tslib',
      'universal-cookie',
      'firebase',
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
