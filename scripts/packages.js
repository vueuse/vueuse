module.exports = [
  ['core', {}],
  ['rxjs', {
    name: 'Rxjs',
    description: 'Enables vue with reactive functions',
    peerDependencies: {
      rxjs: '>=6.0.0',
    },
    external: [
      'rxjs',
      'rxjs/operators',
    ],
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
