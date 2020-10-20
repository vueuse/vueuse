export const packages = [
  ['shared', {
    autoImport: false,
  }],
  ['core', {}],
  ['integrations', {
    name: 'Integrations',
    description: 'Enables RxJS reactive functions in Vue',
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
    external: [
      'rxjs',
      'rxjs/operators',
    ],
    globals: {
      rxjs: 'rxjs',
      'rxjs/operators': 'rxjs.operator',
    },
  }],
  ['firebase', {
    name: 'Firebase',
    description: 'Enables realtime bindings for [Firebase](https://firebase.google.com/)',
    external: [
      'firebase',
      'firebase/app',
    ],
    globals: {
      firebase: 'firebase',
      'firebase/app': 'firebase',
    },
  }],
  // ====== deprecated =====
  ['i18n', {
    deprecated: true,
    name: 'i18n',
    description: '[deprecated] Composition wrapper for [vue-i18n](https://github.com/kazupon/vue-i18n)',
    external: [
      'vue-i18n',
    ],
    globals: {
      'vue-i18n': 'VueI18n',
    },
  }],
]
