import type { PackageIndexes, PackageManifest } from '@vueuse/metadata'
import type { Format, UserConfig } from 'tsdown'
import { readFileSync } from 'node:fs'
import { globSync } from 'tinyglobby'

const metadata = JSON.parse(readFileSync(new URL('./packages/metadata/index.json', import.meta.url), 'utf-8'))
const functions = metadata.functions as PackageIndexes['functions']

const externals = [
  'vue',
  /@vueuse\/.*/,
]

export function createTsDownConfig(
  pkg: PackageManifest,
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

  const iifeName = 'VueUse'
  const functionNames = ['index']

  if (submodules) {
    functionNames.push(...globSync(
      '*/index.ts',
      { cwd },
    ).map(i => i.split('/')[0]))
  }

  for (const fn of functionNames) {
    const entry = fn === 'index'
      ? `index.ts`
      : `${fn}/index.ts`

    const info = functions.find(i => i.name === fn)

    const format: Format[] = []

    if (mjs !== false) {
      format.push('es')
    }

    configs.push({
      entry,
      target,
      format,
      dts,
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

    if (info?.component) {
      configs.push({
        entry: `${fn}/component.ts`,
        external: [
          ...externals,
          ...(external || []),
        ],
      })
    }
  }

  return configs
}
