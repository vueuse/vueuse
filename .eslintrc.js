const { resolve } = require('node:path')

const restricted = [
  'vue',
  '@vue/reactivity',
  '@vue/runtime-core',
  '@vue/runtime-dom',
  '@vue/composition-api',
  '..',
  '../..',
  resolve(__dirname, 'packages/core/index.ts'),
  resolve(__dirname, 'packages/shared/index.ts'),
  {
    name: 'vue-demi',
    importNames: ['onMounted', 'onUnmounted', 'unref', 'toRef'],
  },
]

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: '@antfu',
  rules: {
    'vue/no-deprecated-functional-template': 'off',
    'vue/one-component-per-file': 'off',
    'vue/no-template-shadow': 'off',
    'vue/require-prop-types': 'off',
    'spaced-comment': ['error', 'always', { exceptions: ['#__PURE__'] }],
    'no-restricted-imports': [
      'error',
      {
        paths: restricted,
      },
    ],
    'node/no-callback-literal': 'off',
    'import/namespace': 'off',
    'import/default': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    '@typescript-eslint/ban-types': 'off',
    'n/prefer-global/process': 'off',
  },
  overrides: [
    {
      files: ['packages/shared/**/*.ts'],
      rules: {
        'no-restricted-imports': ['error',
          {
            paths: [
              ...restricted,
              '@vueuse/shared',
            ],
          },
        ],
      },
    },
    {
      files: ['packages/core/**/index.ts'],
      rules: {
        'no-restricted-imports': ['error',
          {
            paths: [
              ...restricted,
              '@vueuse/core',
            ],
          },
        ],
      },
    },
    {
      files: ['**/*.md', '**/*.md/*.*', 'demo.vue', 'demo.client.vue', 'scripts/*.ts', '*.test.ts'],
      rules: {
        'no-alert': 'off',
        'no-console': 'off',
        'no-undef': 'off',
        'no-unused-vars': 'off',
        'no-restricted-imports': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-redeclare': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
    {
      files: ['packages/.vitepress/**/*.*', 'playgrounds/**/*.*'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
  ],
}
