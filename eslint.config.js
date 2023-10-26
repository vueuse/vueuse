import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import antfu from '@antfu/eslint-config'

const dir = fileURLToPath(new URL('.', import.meta.url))
const restricted = [
  'vue',
  '@vue/reactivity',
  '@vue/runtime-core',
  '@vue/runtime-dom',
  '@vue/composition-api',
  '..',
  '../..',
  resolve(dir, 'packages/core/index.ts'),
  resolve(dir, 'packages/shared/index.ts'),
  {
    name: 'vue-demi',
    importNames: ['onMounted', 'onUnmounted', 'unref', 'toRef'],
  },
]

export default antfu(
  {
    ignores: [
      'patches',
      'playgrounds',
      '**/types',
      '**/cache',
      '**/dist',
      '**/.temp',
      '**/*.svg',
    ],
  },
  {
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
      'ts/ban-types': 'off',
      'node/no-callback-literal': 'off',
      'import/namespace': 'off',
      'import/default': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'node/prefer-global/process': 'off',
      'ts/unified-signatures': 'off',
      'ts/no-dynamic-delete': 'off',
    },
  },
  {
    files: [
      'packages/shared/**/*.ts',
    ],
    rules: {
      'no-restricted-imports': ['error', {
        paths: [
          ...restricted,
          '@vueuse/shared',
        ],
      }],
    },
  },
  {
    files: [
      'packages/core/**/index.ts',
    ],
    rules: {
      'no-restricted-imports': ['error', {
        paths: [
          ...restricted,
          '@vueuse/core',
        ],
      }],
    },
  },
  {
    files: [
      '**/*.md',
      '**/*.md/**/*.[jt]s',
      '**/*.md/**/*.vue',
      '**/demo.vue',
      '**/demo.client.vue',
      '**/*.test.ts',
      'scripts/*.ts',
    ],
    rules: {
      'no-alert': 'off',
      'no-console': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-restricted-imports': 'off',
      'ts/no-unused-vars': 'off',
      'ts/no-redeclare': 'off',
      'unused-imports/no-unused-vars': 'off',
    },
  },
  {
    files: [
      'packages/.vitepress/**/*.vue',
      'playgrounds/**/*.vue',
    ],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
)
