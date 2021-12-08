import fs from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { isPackageExists } from 'local-pkg'

const __dirname = dirname(fileURLToPath(import.meta.url))

const disabledFunctions = [
  'useFetch',
  'toRefs',
  'useCookie',
]

const packages = [
  'core',
  'shared',
  'nuxt',
  'integrations',
  'components',
  'motion',
  'firebase',
  'rxjs',
  'sound',
  'head',
]

const fullPackages = packages.map(p => `@vueuse/${p}`)

/**
 * Auto import for VueUse in Nuxt
 * Usage:
 *
 * ```ts
 * // nuxt.config.js
 * export deafult {
 *   buildModules: [
 *     '@vueuse/nuxt'
 *   ]
 * }
 * ```
 */
export default function() {
  const { nuxt } = this

  // opt-out Vite deps optimization for VueUse
  nuxt.hook('vite:extend', ({ config }) => {
    config.optimizeDeps = config.optimizeDeps || {}
    config.optimizeDeps.exclude = config.optimizeDeps.exclude || []
    config.optimizeDeps.exclude.push(...fullPackages)
  })

  // add @vueuse/nuxt to transpile target for alias resolution
  nuxt.options.build = nuxt.options.build || {}
  nuxt.options.build.transpile = nuxt.options.build.transpile || []
  nuxt.options.build.transpile.push('@vueuse/nuxt')

  let indexes

  // auto Import
  nuxt.hook('autoImports:sources', (sources) => {
    if (sources.find(i => fullPackages.includes(i.from)))
      return

    if (!indexes) {
      try {
        indexes = JSON.parse(fs.readFileSync(resolve(__dirname, './indexes.json'), 'utf-8'))
        indexes.functions.forEach((i) => {
          if (i.package === 'shared')
            i.package = 'core'
        })
      }
      catch (e) {
        throw new Error('[@vueuse/nuxt] Failed to load indexes.json')
      }
    }

    if (!indexes)
      return

    for (const pkg of packages) {
      if (pkg === 'core')
        continue

      if (!isPackageExists(`@vueuse/${pkg}`))
        continue

      const functions = indexes
        .functions
        .filter(i => (i.package === 'core' || i.package === 'shared') && !i.internal)

      if (functions.length) {
        sources.push({
          from: `@vueuse/${pkg}`,
          names: indexes
            .functions
            .filter(i => i.package === pkg && !i.internal)
            .map(i => i.name)
            .filter(i => i.length >= 4 && !disabledFunctions.includes(i)),
        })
      }
    }
  })
}
