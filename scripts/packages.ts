export interface PackageManifest {
  name: string
  display: string
  author?: string
  description?: string
  external?: string[]
  globals?: Record<string, string>
  manualImport?: boolean
  deprecated?: boolean
}

export const packages: PackageManifest[] = [
  {
    name: 'shared',
    display: 'Shared utilities',
    manualImport: true,
  },
  {
    name: 'core',
    display: 'VueUse',
  },
  {
    name: 'integrations',
    display: 'Integrations',
    description: 'Enables RxJS reactive functions in Vue',
    external: [
      'rxjs',
      'rxjs/operators',
    ],
    globals: {
      rxjs: 'rxjs',
      'rxjs/operators': 'rxjs.operator',
    },
  },
  {
    name: 'rxjs',
    display: 'RxJS',
    description: 'Enables RxJS reactive functions in Vue',
    external: [
      'rxjs',
      'rxjs/operators',
    ],
    globals: {
      rxjs: 'rxjs',
      'rxjs/operators': 'rxjs.operator',
    },
  },
  {
    name: 'firebase',
    display: 'Firebase',
    description: 'Enables realtime bindings for [Firebase](https://firebase.google.com/)',
    external: [
      'firebase',
      'firebase/app',
    ],
    globals: {
      firebase: 'firebase',
      'firebase/app': 'firebase',
    },
  },
  // ====== deprecated =====
  {
    name: 'i18n',
    display: 'i18n',
    deprecated: true,
    description: '[deprecated] Composition wrapper for [vue-i18n](https://github.com/kazupon/vue-i18n)',
    external: [
      'vue-i18n',
    ],
    globals: {
      'vue-i18n': 'VueI18n',
    },
  },
]

export const activePackages = packages.filter(i => !i.deprecated)
