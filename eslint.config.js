import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import antfu from '@antfu/eslint-config'
import { createSimplePlugin } from 'eslint-factory'
import { createAutoInsert } from 'eslint-plugin-unimport'

const dir = fileURLToPath(new URL('.', import.meta.url))
const restricted = [
  'vue-demi',
  '@vue/reactivity',
  '@vue/runtime-core',
  '@vue/runtime-dom',
  '@vue/composition-api',
  '..',
  '../..',
  resolve(dir, 'packages/core/index.ts'),
  resolve(dir, 'packages/shared/index.ts'),
  {
    name: 'vue',
    importNames: ['onMounted', 'onUnmounted', 'unref', 'toRef'],
  },
]

export default antfu(
  {
    formatters: true,
    pnpm: true,
    test: {
      overrides: {
        'test/padding-around-after-all-blocks': 'error',
        'test/padding-around-after-each-blocks': 'error',
        'test/padding-around-before-all-blocks': 'error',
        'test/padding-around-before-each-blocks': 'error',
        'test/padding-around-describe-blocks': 'error',
        'test/padding-around-test-blocks': 'error',
      },
    },
    ignores: [
      'patches',
      'playgrounds',
      '**/types',
      '**/cache',
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
      'ts/no-unsafe-function-type': 'off',
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
    files: ['packages/core/**/component.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        paths: restricted,
        patterns: [{
          group: ['./*'],
          message: 'Please use `@vueuse/core` instead.',
        }],
      }],
    },
  },
  {
    files: ['packages/**/component.ts'],
    ignores: ['packages/core/**/component.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        paths: restricted,
        patterns: [{
          group: ['@vueuse/*', '!@vueuse/shared', '!@vueuse/core'],
        }],
      }],
    },
  },
  {
    files: [
      'packages/*/index.ts',
    ],
    rules: {
      'perfectionist/sort-exports': 'off',
    },
  },
  {
    files: [
      '**/*.md',
      '**/*.md/*.[jt]s',
      '**/*.md/*.vue',
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
      'vue/no-unused-vars': 'off',
      'vue/no-unused-refs': 'off',
      'vue/require-v-for-key': 'off',
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
  createAutoInsert({
    imports: [
      {
        from: 'vue',
        name: 'shallowRef',
      },
      {
        from: 'vue',
        name: 'ref',
        as: 'deepRef',
      },
    ],
  }),
  createSimplePlugin({
    name: 'no-ref',
    exclude: ['**/*.md', '**/*.md/**'],
    create(context) {
      return {
        CallExpression(node) {
          if (node.callee.type === 'Identifier' && node.callee.name === 'ref') {
            context.report({
              node,
              message: 'Usage of ref() is restricted. Use shallowRef() or deepRef() instead.',
            })
          }
        },
      }
    },
  }),
)
