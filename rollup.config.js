import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import dts from 'rollup-plugin-dts'
import { packages } from './scripts/packages'

const configs = []

for (const [pkg, options] of packages) {
  if (options.deprecated)
    continue

  const globals = {
    'vue-demi': 'VueDemi',
    '@vue/shared': 'VueUseShared',
    ...(options.globals || {}),
  }
  const name = pkg === 'core' ? 'VueUse' : `VueUse${options.name}`

  configs.push({
    input: `packages/${pkg}/index.ts`,
    output: [
      {
        file: `packages/${pkg}/dist/index.cjs.js`,
        format: 'cjs',
      },
      {
        file: `packages/${pkg}/dist/index.esm.js`,
        format: 'es',
      },
      {
        file: `packages/${pkg}/dist/index.umd.js`,
        format: 'umd',
        name,
        globals,
      },
      {
        file: `packages/${pkg}/dist/index.umd.min.js`,
        format: 'umd',
        name,
        globals,
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
      '@vue/composition-api',
      '@vue/runtime-dom',
      ...(options.external || []),
    ],
  })

  configs.push({
    input: `packages/${pkg}/index.ts`,
    output: {
      file: `packages/${pkg}/dist/index.d.ts`,
      format: 'es',
    },
    plugins: [
      dts(),
    ],
  })
}

export default configs
