import type { PackageIndexes } from '@vueuse/metadata'
import type { OutputOptions, RollupOptions } from 'rollup'
import type { Options as ESBuildOptions } from 'rollup-plugin-esbuild'
import fs from 'node:fs'
import { resolve } from 'node:path'
import json from '@rollup/plugin-json'
import fg from 'fast-glob'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import { PluginPure as pure } from 'rollup-plugin-pure'
import { packages } from './meta/packages'

const metadata = JSON.parse(fs.readFileSync('./packages/metadata/index.json', 'utf-8'))
const functions = metadata.functions as PackageIndexes['functions']

const configs: RollupOptions[] = []

const pluginEsbuild = esbuild()
const pluginDts = dts()
const pluginPure = pure({
  functions: ['defineComponent'],
})

const externals = [
  'vue',
  '@vueuse/shared',
  '@vueuse/core',
  '@vueuse/metadata',
]

function esbuildMinifer(options: ESBuildOptions) {
  const { renderChunk } = esbuild(options)

  return {
    name: 'esbuild-minifer',
    renderChunk,
  }
}

for (const { globals, name, external, submodules, iife, build, cjs, mjs, dts, target = 'es2018' } of packages) {
  if (build === false)
    continue

  const iifeGlobals = {
    'vue': 'Vue',
    '@vueuse/shared': 'VueUse',
    '@vueuse/core': 'VueUse',
    ...(globals || {}),
  }

  const iifeName = 'VueUse'
  const functionNames = ['index']

  if (submodules)
    functionNames.push(...fg.sync('*/index.ts', { cwd: resolve(`packages/${name}`) }).map(i => i.split('/')[0]))

  for (const fn of functionNames) {
    const input = fn === 'index'
      ? `packages/${name}/index.ts`
      : `packages/${name}/${fn}/index.ts`

    const info = functions.find(i => i.name === fn)

    const output: OutputOptions[] = []

    if (mjs !== false) {
      output.push({
        file: `packages/${name}/dist/${fn}.mjs`,
        format: 'es',
      })
    }

    if (cjs !== false) {
      output.push({
        file: `packages/${name}/dist/${fn}.cjs`,
        format: 'cjs',
      })
    }

    if (iife !== false) {
      output.push(
        {
          file: `packages/${name}/dist/${fn}.iife.js`,
          format: 'iife',
          name: iifeName,
          extend: true,
          globals: iifeGlobals,
          plugins: [
          ],
        },
        {
          file: `packages/${name}/dist/${fn}.iife.min.js`,
          format: 'iife',
          name: iifeName,
          extend: true,
          globals: iifeGlobals,
          plugins: [
            esbuildMinifer({
              minify: true,
            }),
          ],
        },
      )
    }

    configs.push({
      input,
      output,
      plugins: [
        target
          ? esbuild({ target })
          : pluginEsbuild,
        json(),
        pluginPure,
      ],
      external: [
        ...externals,
        ...(external || []),
      ],
    })

    if (dts !== false) {
      configs.push({
        input,
        output: [
          { file: `packages/${name}/dist/${fn}.d.cts` },
          { file: `packages/${name}/dist/${fn}.d.mts` },
          { file: `packages/${name}/dist/${fn}.d.ts` }, // for node10 compatibility
        ],
        plugins: [
          pluginDts,
        ],
        external: [
          ...externals,
          ...(external || []),
        ],
      })
    }

    if (info?.component) {
      configs.push({
        input: `packages/${name}/${fn}/component.ts`,
        output: [
          {
            file: `packages/${name}/dist/${fn}/component.cjs`,
            format: 'cjs',
          },
          {
            file: `packages/${name}/dist/${fn}/component.mjs`,
            format: 'es',
          },
        ],
        plugins: [
          pluginEsbuild,
          pluginPure,
        ],
        external: [
          ...externals,
          ...(external || []),
        ],
      })

      configs.push({
        input: `packages/${name}/${fn}/component.ts`,
        output: [
          { file: `packages/${name}/dist/${fn}/component.d.cts` },
          { file: `packages/${name}/dist/${fn}/component.d.mts` },
          { file: `packages/${name}/dist/${fn}/component.d.ts` }, // for node10 compatibility
        ],
        plugins: [
          pluginDts,
        ],
        external: [
          ...externals,
          ...(external || []),
        ],
      })
    }
  }
}

export default configs
