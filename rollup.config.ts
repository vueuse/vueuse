import type { PackageIndexes, PackageManifest } from '@vueuse/metadata'
import type { OutputOptions, RollupOptions } from 'rollup'
import type { Options as ESBuildOptions } from 'rollup-plugin-esbuild'
import fs from 'node:fs'
import json from '@rollup/plugin-json'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import { PluginPure as pure } from 'rollup-plugin-pure'
import { globSync } from 'tinyglobby'

const metadata = JSON.parse(fs.readFileSync(new URL('./packages/metadata/index.json', import.meta.url), 'utf-8'))
const functions = metadata.functions as PackageIndexes['functions']

const configs: RollupOptions[] = []

const pluginEsbuild = esbuild()
const pluginDts = dts()
const pluginPure = pure({
  functions: ['defineComponent'],
})

function esbuildMinifier(options: ESBuildOptions) {
  const { renderChunk } = esbuild(options)

  return {
    name: 'esbuild-minifier',
    renderChunk,
  }
}

const externals = [
  'vue',
  /@vueuse\/.*/,
]

export function createRollupConfig(
  pkg: PackageManifest,
  cwd = process.cwd(),
) {
  const { globals, external, submodules, iife, build, cjs, mjs, dts, target = 'es2018' } = pkg
  if (build === false)
    return []

  const iifeGlobals = {
    'vue': 'Vue',
    '@vueuse/shared': 'VueUse',
    '@vueuse/core': 'VueUse',
    ...(globals || {}),
  }

  const iifeName = 'VueUse'
  const functionNames = ['index']

  if (submodules) {
    functionNames.push(...globSync(
      '*/index.ts',
      { cwd },
    ).map(i => i.split('/')[0]))
  }

  for (const fn of functionNames) {
    const input = fn === 'index'
      ? `index.ts`
      : `${fn}/index.ts`

    const info = functions.find(i => i.name === fn)

    const output: OutputOptions[] = []

    if (mjs !== false) {
      output.push({
        file: `${fn}.mjs`,
        format: 'es',
      })
    }

    if (cjs !== false) {
      output.push({
        file: `${fn}.cjs`,
        format: 'cjs',
      })
    }

    if (iife !== false) {
      output.push(
        {
          file: `${fn}.iife.js`,
          format: 'iife',
          name: iifeName,
          extend: true,
          globals: iifeGlobals,
          plugins: [],
        },
        {
          file: `${fn}.iife.min.js`,
          format: 'iife',
          name: iifeName,
          extend: true,
          globals: iifeGlobals,
          plugins: [
            esbuildMinifier({
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
          { file: `${fn}.d.cts` },
          { file: `${fn}.d.mts` },
          { file: `${fn}.d.ts` }, // for node10 compatibility
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
        input: `${fn}/component.ts`,
        output: [
          {
            file: `${fn}/component.cjs`,
            format: 'cjs',
          },
          {
            file: `${fn}/component.mjs`,
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
        input: `${fn}/component.ts`,
        output: [
          { file: `${fn}/component.d.cts` },
          { file: `${fn}/component.d.mts` },
          { file: `${fn}/component.d.ts` }, // for node10 compatibility
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

  return configs
}
