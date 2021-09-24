import fs from 'fs'
import { join, relative, resolve } from 'path'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import dts from 'rollup-plugin-dts'
import type { OutputOptions, Plugin, RollupOptions } from 'rollup'
import fg from 'fast-glob'
import { activePackages } from '../meta/packages'
import type { PackageManifest } from '../meta/types'
import { getSubmoduleNames, isFilledArray, isFilledString, prepareFilePath } from './utils'

const VUE_DEMI_IIFE = fs.readFileSync(require.resolve('vue-demi/lib/index.iife.js'), 'utf-8')
const configs: RollupOptions[] = []

const injectVueDemi: Plugin = {
  name: 'inject-vue-demi',
  renderChunk(code) {
    return `${VUE_DEMI_IIFE};\n;${code}`
  },
}

function prepareOutput({ globals, iife }: Pick<PackageManifest, 'globals' | 'name' | 'iife'>) {
  const iifeGlobals = {
    'vue-demi': 'VueDemi',
    '@vueuse/shared': 'VueUse',
    '@vueuse/core': 'VueUse',
    ...(globals || {}),
  }

  const iifeName = 'VueUse'

  return (fn: string, getFunctionPath: ReturnType<typeof prepareFilePath>) => {
    const fnPath = getFunctionPath(fn)

    const output: OutputOptions[] = [
      {
        file: `${fnPath}.cjs`,
        format: 'cjs',
      },
      {
        file: `${fnPath}.mjs`,
        format: 'es',
      },
    ]

    if (iife === false) return output

    output.push(
      {
        file: `${fnPath}.iife.js`,
        format: 'iife',
        name: iifeName,
        extend: true,
        globals: iifeGlobals,
        plugins: [
          injectVueDemi,
        ],
      },
      {
        file: `${fnPath}.iife.min.js`,
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

    return output
  }
}

function setupPackage(pkg: PackageManifest, parent?: string) {
  const { name, external, packages, submodules } = pkg
  const getOutput = prepareOutput(pkg)
  const getFunctionPath = prepareFilePath(name, parent)
  const submoduleNames = getSubmoduleNames(packages)
  const functionNames = ['index']

  if (submodules) {
    functionNames.push(
      ...fg.sync('*/index.ts', { cwd: resolve(`packages/${name}`) })
        .map(i => i.split('/')[0])
        .filter(i => isFilledString(i) && !submoduleNames.includes(i)),
    )
  }

  for (const fn of functionNames) {
    const input = fn === 'index' ? `packages/${name}/index.ts` : `packages/${name}/${fn}/index.ts`

    const output = getOutput(fn, getFunctionPath)

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
        file: `${getFunctionPath(fn)}.d.ts`,
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

  if (isFilledArray(packages))
    packages.forEach(submodule => setupPackage(submodule, name))
}

for (const pkg of activePackages) setupPackage(pkg)

export default configs
