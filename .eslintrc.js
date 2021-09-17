module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  extends: '@antfu/eslint-config',
  plugins: [
    'markdown',
    'jest',
  ],
  rules: {
    'react/no-string-refs': 'off',
    'react/no-unknown-property': 'off',
    'vue/no-deprecated-functional-template': 'off',
    'vue/one-component-per-file': 'off',
    'vue/no-template-shadow': 'off',
    'vue/require-prop-types': 'off',
    'spaced-comment': ['error', 'always', { exceptions: ['#__PURE__'] }],
    'no-restricted-imports': [
      'error',
      {
        paths: ['vue', '@vue/composition-api'],
      },
    ],
    'node/no-callback-literal': 'off',
  },
  overrides: [
    {
      files: ['*.md', 'demo.vue', 'scripts/*.ts', '*.test.ts'],
      rules: {
        'no-alert': 'off',
        'no-console': 'off',
        'no-undef': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-restricted-imports': 'off',
      },
    },
    {
      files: ['packages/.vitepress/**/*.*'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
  ],
}
