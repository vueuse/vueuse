import type { PackageIndexes, PackageManifest } from '@vueuse/metadata'
import type { Format, UserConfig } from 'tsdown'
import { globSync } from 'tinyglobby'
import { StaleGuardRecorder } from 'tsdown-stale-guard'
import metadata from './packages/metadata/index.json' with { type: 'json' }

const functions = metadata.functions as PackageIndexes['functions']

const externals = [
  'vue',
  /@vueuse\/.*/,
]

export function createTsDownConfig(
  pkg: PackageManifest,
  copy?: UserConfig['copy'],
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

  const baseConfig: UserConfig = {
    target,
    dts,
    platform: 'browser',
    deps: {
      neverBundle: [
        ...externals,
        ...(external || []),
      ],
    },
  }

  const configs: UserConfig[] = []

  const functionNames = ['index']
  if (submodules) {
    functionNames.push(...globSync(
      '*/index.ts',
      { cwd },
    ).map(i => i.split('/')[0]))
  }

  const entry: Record<string, string> = {}

  for (const fn of functionNames) {
    const fnEntry = {
      [fn]: fn === 'index' ? 'index.ts' : `${fn}/index.ts`,
    }

    if (iife !== false) {
      const BASE_IIFE_CONFIG: UserConfig = {
        ...baseConfig,
        entry: fnEntry,
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

    Object.assign(entry, fnEntry)

    const info = functions.find(i => i.name === fn)

    if (info?.component) {
      Object.assign(entry, { [`${fn}/component`]: `${fn}/component.ts` })
    }
  }

  configs.push({
    ...baseConfig,
    entry,
    format,
    copy,
    plugins: [StaleGuardRecorder()],
    attw: {
      level: 'error',
      profile: 'esm-only',
      ignoreRules: ['cjs-resolves-to-esm'],
    },
  })

  return configs
}
