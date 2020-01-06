module.exports = [
  ['core', {}],

  ['firebase', {
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
]
