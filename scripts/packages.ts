export type PackageInfo = [string, any]

export const packages: PackageInfo[] = [
  ['core', {}],
  ['integrations', {
    name: 'Integrations',
    description: 'Enables RxJS reactive functions in Vue',
    peerDependencies: {
      rxjs: '>=6.0.0',
    },
    external: [
      'rxjs',
      'rxjs/operators',
    ],
    globals: {
      rxjs: 'rxjs',
      'rxjs/operators': 'rxjs.operator',
    },
  }],
  ['rxjs', {
    name: 'RxJS',
    description: 'Enables RxJS reactive functions in Vue',
    peerDependencies: {
      rxjs: '>=6.0.0',
    },
    external: [
      'rxjs',
      'rxjs/operators',
    ],
    globals: {
      rxjs: 'rxjs',
      'rxjs/operators': 'rxjs.operator',
    },
    keywords: [
      'rxjs',
      'reactive',
    ],
  }],
  ['firebase', {
    name: 'Firebase',
    description: 'Enables realtime bindings for [Firebase](https://firebase.google.com/)',
    peerDependencies: {
      firebase: '>=4.0.0',
    },
    external: [
      'firebase',
      'firebase/app',
    ],
    globals: {
      firebase: 'firebase',
      'firebase/app': 'firebase',
    },
    keywords: [
      'firebase',
      'vuefire',
    ],
  }],
  // ====== deprecated =====
  ['i18n', {
    deprecated: true,
    name: 'i18n',
    description: '[deprecated] Composition wrapper for [vue-i18n](https://github.com/kazupon/vue-i18n)',
    peerDependencies: {
      'vue-i18n': '>=6.0.0',
    },
    external: [
      'vue-i18n',
    ],
    globals: {
      'vue-i18n': 'VueI18n',
    },
    keywords: [
      'deprecated',
    ],
  }],
]
