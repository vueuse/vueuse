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
    author: 'Jacob Clevenger<https://github.com/wheatjs>',
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
    submodules: true,
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
    display: 'Firebase 8',
    description: 'Enables realtime bindings for libraries dependent on Firebase SDK v8',
    addon: true,
    submodules: true,
    external: [
      'firebase',
      'firebase/app',
    ],
    globals: {
      'firebase': 'firebase',
      'firebase/app': 'firebase',
    },
    installDependencies: true,
  },
  {
    name: 'firebase-9',
    display: 'Firebase 9',
    description: 'Enables realtime bindings for Firebase SDK v9 modular libraries',
    addon: true,
    submodules: true,
    external: [
      'firebase/auth',
      'firebase/database',
      'firebase/firestore',
    ],
    iife: false,
    packages: [
      {
        name: 'firebase-9/compat',
        display: 'Firebase 9 compat',
        description: 'Enables realtime bindings for Firebase SDK v9 compat libraries',
        submodules: true,
        addon: true,
        iife: true,
        external: [
          'firebase/compat',
          'firebase/compat/app',
        ],
        globals: {
          'firebase/compat': 'firebase',
          'firebase/compat/app': 'firebase',
        },
      },
    ],
  },
  {
    name: 'electron',
    display: 'Electron',
    description: 'Electron renderer process modules for VueUse',
    author: 'Archer Gu<https://github.com/ArcherGu>',
    addon: true,
    external: [
      'electron',
    ],
    iife: false,
  },
]

export const activePackages = packages.filter(i => !i.deprecated)
export const allPackages = packages.map(pkg => [pkg, ...(Array.isArray(pkg.packages) ? pkg.packages : [])]).flat()
