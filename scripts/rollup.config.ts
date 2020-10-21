
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import dts from 'rollup-plugin-dts'
import { activePackages } from './packages'

const configs = []

for (const { globals, name, display, external } of activePackages) {
  const umdGlobals = {
    'vue-demi': 'VueDemi',
    '@vueuse/shared': 'VueUseShared',
    ...(globals || {}),
  }
  const umdName = name === 'core' ? 'VueUse' : `VueUse${display}`

  configs.push({
    input: `packages/${name}/index.ts`,
    output: [
      {
        file: `packages/${name}/dist/index.cjs.js`,
        format: 'cjs',
      },
      {
        file: `packages/${name}/dist/index.esm.js`,
        format: 'es',
      },
      {
        file: `packages/${name}/dist/index.umd.js`,
        format: 'umd',
        name: umdName,
        globals: umdGlobals,
      },
      {
        file: `packages/${name}/dist/index.umd.min.js`,
        format: 'umd',
        name: umdName,
        globals: umdGlobals,
        plugins: [
          terser({
            format: {
              comments: false,
            },
          }),
        ],
      },
    ],
    plugins: [
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            declaration: false,
          },
        },
      }),
    ],
    external: [
      'vue-demi',
      'vue',
      '@vueuse/shared',
      '@vue/composition-api',
      '@vue/runtime-dom',
      ...(external || []),
    ],
  })

  configs.push({
    input: `packages/${name}/index.ts`,
    output: {
      file: `packages/${name}/dist/index.d.ts`,
      format: 'es',
    },
    plugins: [
      dts(),
    ],
  })
}

export default configs
