import type { PackageIndexes, PackageManifest } from '@vueuse/metadata'
import type { Format, Options, UserConfig } from 'tsdown'
import { globSync } from 'tinyglobby'
import metadata from './packages/metadata/index.json' with { type: 'json' }

const functions = metadata.functions as PackageIndexes['functions']

const externals = [
  'vue',
  /@vueuse\/.*/,
]

export function createTsDownConfig(
  pkg: PackageManifest,
  copy?: Options['copy'],
  cwd = process.cwd(),
) {
  const { globals, external, submodules, iife, build, mjs, dts, target = 'es2018' } = pkg

  if (build === false)
    return []

  const iifeName = 'VueUse'
  const iifeGlobals = {
    'vue': 'Vue',
    '@vueuse/shared': 'VueUse',
    '@vueuse/core': 'VueUse',
    ...(globals || {}),
  }

  const format: Format[] = []
  if (mjs !== false) {
    format.push('es')
  }

  let baseConfig: UserConfig = {
    target,
    dts,
    platform: 'browser',
    external: [
      ...externals,
      ...(external || []),
    ],
  }

  const configs: UserConfig[] = []

  const functionNames = ['index']
  if (submodules) {
    functionNames.push(...globSync(
      '*/index.ts',
      { cwd },
    ).map(i => i.split('/')[0]))
  }

  for (const fn of functionNames) {
    baseConfig = {
      ...baseConfig,
      entry: {
        [fn]: fn === 'index' ? 'index.ts' : `${fn}/index.ts`,
      },
    }

    configs.push({
      ...baseConfig,
      format,
      copy,
    })

    if (iife !== false) {
      const BASE_IIFE_CONFIG: UserConfig = {
        ...baseConfig,
        format: 'iife',
        globalName: iifeName,
        outputOptions: {
          extend: true,
          globals: iifeGlobals,
        },
      }

      configs.push(
        BASE_IIFE_CONFIG,
        {
          ...BASE_IIFE_CONFIG,
          minify: true,
          outExtensions: () => ({
            js: '.min.js',
          }),
        },
      )
    }

    const info = functions.find(i => i.name === fn)

    if (info?.component) {
      configs.push({
        ...baseConfig,
        entry: {
          [`${fn}/component`]: `${fn}/component.ts`,
        },
      })
    }
  }

  return configs
}
