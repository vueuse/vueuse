import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import antfu from '@antfu/eslint-config'
import { ESLintUtils } from '@typescript-eslint/utils'
import { createSimplePlugin } from 'eslint-factory'
import { createAutoInsert } from 'eslint-plugin-unimport'
import * as tsutils from 'ts-api-utils'
import ts from 'typescript'

const { getParserServices } = ESLintUtils

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
  createSimplePlugin({
    name: 'no-primitive-shallow',
    severity: 'warn',
    include: [
      'packages/**/index.test.ts',
      'packages/**/index.ts',
      'foo.ts',
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    create(context) {
      const services = getParserServices(context)
      // const checker = services.program.getTypeChecker()
      const hasPrimitiveFlags = type => tsutils.isTypeFlagSet(
        type,
        (
          ts.TypeFlags.StringLike
          | ts.TypeFlags.NumberLike
          | ts.TypeFlags.BooleanLike
          | ts.TypeFlags.Null
          | ts.TypeFlags.Undefined
          | ts.TypeFlags.BigIntLike
          | ts.TypeFlags.EnumLike
          | ts.TypeFlags.ESSymbolLike
        ),
      )
      const isPrimitive = type => hasPrimitiveFlags(type)
        || (
          type.isUnion()
          && type.types.every(t => hasPrimitiveFlags(t))
        )
      return {
        VariableDeclarator(node) {
          const { id, init } = node

          if (!init || init.type !== 'CallExpression' || init.callee.type !== 'Identifier' || init.callee.name !== 'deepRef') {
            return
          }

          if (init.arguments.length !== 1) {
            return
          }

          const [arg] = init.arguments
          const argType = services.getTypeAtLocation(arg)
          const { typeArguments } = init
          const typeArgument = typeArguments?.params[0]
          let hasPrimitiveValue = false

          if (typeArgument) {
            const typeArgumentType = services.getTypeAtLocation(typeArgument)

            hasPrimitiveValue = isPrimitive(typeArgumentType)
          }
          else {
            if (id.type === 'Identifier'
              && id.typeAnnotation !== undefined
              && id.typeAnnotation.type === 'TSTypeAnnotation'
              && id.typeAnnotation.typeAnnotation !== undefined
              && id.typeAnnotation.typeAnnotation.type === 'TSTypeReference'
              && id.typeAnnotation.typeAnnotation.typeName.type === 'Identifier'
              && id.typeAnnotation.typeAnnotation.typeName.name === 'Ref'
              && id.typeAnnotation.typeAnnotation.typeArguments.params.length === 1) {
              const typeArgument = id.typeAnnotation.typeAnnotation.typeArguments.params[0]
              const typeArgumentType = services.getTypeAtLocation(typeArgument)
              hasPrimitiveValue = isPrimitive(typeArgumentType)
            }
            else {
              hasPrimitiveValue = isPrimitive(argType)
            }
          }

          if (hasPrimitiveValue) {
            context.report({
              node: init.callee,
              message: 'Usage of primitive value in deepRef() is restricted. Use shallowRef() instead.',
              fix(fixer) {
                return fixer.replaceText(init.callee, 'shallowRef')
              },
            })
          }
        },
      }
    },
  }),
)
