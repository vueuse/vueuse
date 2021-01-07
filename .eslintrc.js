module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  extends: [
    '@antfu/eslint-config',
  ],
  plugins: [
    'markdown',
    'jest',
  ],
  rules: {
    'no-alert': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/no-null': 'off',
    'unicorn/filename-case': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/no-string-refs': 'off',
    'no-new': 'off',
    'import/order': 'off',
    'react/no-unknown-property': 'off',
    'spaced-comment': ['error', 'always', { exceptions: ['@__PURE__'] }],
  },
  overrides: [
    {
      files: ['*.md'],
      rules: {
        'no-undef': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
}
