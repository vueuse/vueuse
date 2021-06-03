
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import dts from 'rollup-plugin-dts'
import { Plugin } from 'rollup'
import { activePackages } from '../meta/packages'
import fs from 'fs'
import fg from 'fast-glob'
import { resolve } from 'path'

const VUE_DEMI_IIFE = fs.readFileSync(require.resolve('vue-demi/lib/index.iife.js'), 'utf-8')
const configs = []

const injectVueDemi: Plugin = {
  name: 'inject-vue-demi',
  renderChunk(code) {
    return `${VUE_DEMI_IIFE};\n;${code}`
  },
}

for (const { globals, name, external, submodules } of activePackages) {
  const iifeGlobals = {
    'vue-demi': 'VueDemi',
    '@vueuse/shared': 'VueUse',
    '@vueuse/core': 'VueUse',
    ...(globals || {}),
  }

  const iifeName = 'VueUse'
  const functionNames = ['index']

  if (submodules)
    functionNames.push(...fg.sync('*/index.ts', { cwd: resolve(`packages/${name}`) }).map(i => i.split('/')[0]))

  for (const fn of functionNames) {
    const input = fn === 'index' ? `packages/${name}/index.ts` : `packages/${name}/${fn}/index.ts`

    configs.push({
      input,
      output: [
        {
          file: `packages/${name}/dist/${fn}.cjs.js`,
          format: 'cjs',
        },
        {
          file: `packages/${name}/dist/${fn}.esm.js`,
          format: 'es',
        },
        {
          file: `packages/${name}/dist/${fn}.iife.js`,
          format: 'iife',
          name: iifeName,
          extend: true,
          globals: iifeGlobals,
          plugins: [
            injectVueDemi,
          ],
        },
        {
          file: `packages/${name}/dist/${fn}.iife.min.js`,
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
      input,
      output: {
        file: `packages/${name}/dist/${fn}.d.ts`,
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
}

export default configs
