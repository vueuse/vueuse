import type { PackageManifest } from '@vueuse/metadata'
import type { Format, Options, UserConfig } from 'tsdown'
import { globSync } from 'tinyglobby'

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

  const configs: UserConfig[] = []

  const iifeGlobals = {
    'vue': 'Vue',
    '@vueuse/shared': 'VueUse',
    '@vueuse/core': 'VueUse',
    ...(globals || {}),
  }

  const entry = ['index.ts']
  const format: Format[] = []

  const iifeName = 'VueUse'
  const functionNames = ['index']

  if (submodules) {
    functionNames.push(...globSync(
      '*/index.ts',
      { cwd },
    ).map(i => i.split('/')[0]))
  }

  if (mjs !== false) {
    format.push('es')
  }

  configs.push({
    entry,
    target,
    format,
    dts,
    copy,
    external: [
      ...externals,
      ...(external || []),
    ],
  })

  if (iife !== false) {
    const baseIIFEConfig: UserConfig = {
      entry,
      format: 'iife',
      name: iifeName,
      alias: iifeGlobals,
    }
    configs.push(
      baseIIFEConfig,
      {
        ...baseIIFEConfig,
        minify: true,
        outExtensions: () => ({
          js: '.min.js',
        }),
      },
    )
  }

  return configs
}
