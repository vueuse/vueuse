import { PackageManifest } from './types'

export const packages: PackageManifest[] = [
  {
    name: 'shared',
    display: 'Shared utilities',
  },
  {
    name: 'core',
    display: 'VueUse',
    description: 'Collection of essential Vue Composition Utilities',
  },
  {
    name: 'components',
    display: 'Components',
    description: 'Renderless components for VueUse',
    author: 'Wheat<https://github.com/wheatjs>',
    external: [
      '@vueuse/core',
      '@vueuse/shared',
    ],
  },
  {
    name: 'router',
    display: 'Router',
    description: 'Utilities for vue-router',
    addon: true,
    external: [
      'vue-router',
    ],
    globals: {
      'vue-router': 'VueRouter',
    },
  },
  {
    name: 'integrations',
    display: 'Integrations',
    description: 'Integration wrappers for utility libraries',
    addon: true,
    external: [
      'axios',
      'universal-cookie',
      'qrcode',
      'http',
      'nprogress',
      'jwt-decode',
      'focus-trap',
    ],
    globals: {
      'axios': 'axios',
      'universal-cookie': 'UniversalCookie',
      'qrcode': 'QRCode',
      'nprogress': 'nprogress',
      'jwt-decode': 'jwt_decode',
      'focus-trap': 'focusTrap',
    },
  },
  {
    name: 'rxjs',
    display: 'RxJS',
    description: 'Enables RxJS reactive functions in Vue',
    addon: true,
    external: [
      'rxjs',
      'rxjs/operators',
    ],
    globals: {
      'rxjs': 'rxjs',
      'rxjs/operators': 'rxjs.operator',
    },
  },
  {
    name: 'firebase',
    display: 'Firebase',
    description: 'Enables realtime bindings for Firebase',
    addon: true,
    external: [
      'firebase',
      'firebase/app',
    ],
    globals: {
      'firebase': 'firebase',
      'firebase/app': 'firebase',
    },
  },
]

export const activePackages = packages.filter(i => !i.deprecated)
