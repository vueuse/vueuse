import fs from 'fs'
import { resolve } from 'path'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import dts from 'rollup-plugin-dts'
import { OutputOptions, Plugin, RollupOptions } from 'rollup'
import fg from 'fast-glob'
import { activePackages } from '../meta/packages'

const VUE_DEMI_IIFE = fs.readFileSync(require.resolve('vue-demi/lib/index.iife.js'), 'utf-8')
const configs: RollupOptions[] = []

const injectVueDemi: Plugin = {
  name: 'inject-vue-demi',
  renderChunk(code) {
    return `${VUE_DEMI_IIFE};\n;${code}`
  },
}

for (const { globals, name, external, submodules, iife } of activePackages) {
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

    const output: OutputOptions[] = [
      {
        file: `packages/${name}/dist/${fn}.cjs.js`,
        format: 'cjs',
      },
      {
        file: `packages/${name}/dist/${fn}.esm.js`,
        format: 'es',
      },
    ]

    if (iife !== false) {
      output.push(
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
      )
    }

    configs.push({
      input,
      output,
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
