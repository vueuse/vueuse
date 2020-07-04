// rollup.config.js
import typescript from 'rollup-plugin-typescript2'
import { uglify } from 'rollup-plugin-uglify'
import dts from 'rollup-plugin-dts'
import path from 'path'

const packages = require('./scripts/packages')
const configs = []

for (const [pkg, options] of packages) {
  const globals = {
    vue: 'Vue',
    'vue-demi': 'VueDemi',
    '@vue/composition-api': 'VueCompositionAPI',
    '@vue/runtime-dom': 'Vue',
    ...(options.globals || {}),
  }
  const name = 'VueUse'

  configs.push({
    input: `packages/${pkg}/index.ts`,
    output: [
      {
        file: `dist/${pkg}/index.cjs.js`,
        format: 'cjs',
      },
      {
        file: `dist/${pkg}/index.esm.js`,
        format: 'es',
      },
      {
        file: `dist/${pkg}/index.umd.js`,
        format: 'umd',
        name,
        globals,
      },
      {
        file: `dist/${pkg}/index.umd.min.js`,
        format: 'umd',
        name,
        globals,
        plugins: [
          uglify(),
        ],
      },
    ],
    plugins: [
      typescript({
        tsconfig: path.resolve(__dirname, 'tsconfig.rollup.json'),
        tsconfigOverride: {
          declaration: false,
          declarationDir: null,
          declarationMap: false,
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
    input: `./typings/${pkg}/index.d.ts`,
    output: {
      file: `dist/${pkg}/index.d.ts`,
      format: 'es',
    },
    plugins: [
      dts(),
    ],
  })
}

export default configs
