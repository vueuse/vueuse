
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import dts from 'rollup-plugin-dts'
import { Plugin } from 'rollup'
import { activePackages } from '../meta/packages'
import fs from 'fs'

const VUE_DEMI_IIFE = fs.readFileSync(require.resolve('vue-demi/lib/index.iife.js'), 'utf-8')
const configs = []

const injectVueDemi: Plugin = {
  name: 'inject-vue-demi',
  renderChunk(code) {
    return `${VUE_DEMI_IIFE};\n;${code}`
  },
}

for (const { globals, name, external } of activePackages) {
  const iifeGlobals = {
    'vue-demi': 'VueDemi',
    '@vueuse/shared': 'VueUse',
    '@vueuse/core': 'VueUse',
    ...(globals || {}),
  }

  const iifeName = 'VueUse'

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
        file: `packages/${name}/dist/index.iife.js`,
        format: 'iife',
        name: iifeName,
        extend: true,
        globals: iifeGlobals,
        plugins: [
          injectVueDemi,
        ],
      },
      {
        file: `packages/${name}/dist/index.iife.min.js`,
        format: 'iife',
        name: iifeName,
        extend: true,
        globals: iifeGlobals,
        plugins: [
          injectVueDemi,
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
      '@vueuse/shared',
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
    external: [
      'vue-demi',
      '@vueuse/shared',
      ...(external || []),
    ],
  })
}

export default configs
