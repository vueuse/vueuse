import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { isPackageExists } from 'local-pkg'
import { defineNuxtModule } from '@nuxt/kit'
import { metadata } from '@vueuse/metadata'
import type { Import } from 'unimport'

const _dirname = dirname(fileURLToPath(import.meta.url))

const disabledFunctions = [
  'useFetch',
  'toRefs',
  'useCookie',
  'useHead',
  'useTitle',
  'useStorage',
]

const packages = [
  'core',
  'shared',
  'components',
  'motion',
  'firebase',
  'rxjs',
  'sound',
  'math',
]

const fullPackages = packages.map(p => `@vueuse/${p}`)

export interface VueUseNuxtOptions {
  /**
   * @default true
   */
  autoImports?: boolean

  /**
   * @expiremental
   * @default false
   */
  ssrHandlers?: boolean
}

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
export default defineNuxtModule<VueUseNuxtOptions>({
  meta: {
    name: 'vueuse',
    configKey: 'vueuse',
  },
  defaults: {
    ssrHandlers: false,
    autoImports: true,
  },
  setup(options, nuxt) {
    // opt-out Vite deps optimization for VueUse
    nuxt.hook('vite:extend', ({ config }: any) => {
      config.optimizeDeps = config.optimizeDeps || {}
      config.optimizeDeps.exclude = config.optimizeDeps.exclude || []
      config.optimizeDeps.exclude.push(...fullPackages)
    })

    // add pacages to transpile target for alias resolution
    nuxt.options.build = nuxt.options.build || {}
    nuxt.options.build.transpile = nuxt.options.build.transpile || []
    nuxt.options.build.transpile.push(...fullPackages)

    if (options.ssrHandlers) {
      const pluginPath = resolve(_dirname, './ssr-plugin.mjs')
      nuxt.options.plugins = nuxt.options.plugins || []
      nuxt.options.plugins.push(pluginPath)
      nuxt.options.build.transpile.push(pluginPath)
    }

    if (options.autoImports) {
      // auto Import
      nuxt.hook('autoImports:sources', (sources: any[]) => {
        if (sources.find(i => fullPackages.includes(i.from)))
          return

        metadata.functions.forEach((i) => {
          if (i.package === 'shared')
            i.package = 'core'
        })

        for (const pkg of packages) {
          if (pkg === 'shared')
            continue

          if (!isPackageExists(`@vueuse/${pkg}`))
            continue

          const imports = metadata
            .functions
            .filter(i => i.package === pkg && !i.internal)
            .flatMap((i): Import[] => {
              const names = [i.name, ...i.alias || []]
              return names.map(n => ({
                from: `@vueuse/${i.importPath || i.package}`,
                name: n,
                as: n,
                priority: -1,
              }))
            })
            .filter(i => i.name.length >= 4 && !disabledFunctions.includes(i.name))

          sources.push({
            from: '@vueuse/core',
            imports,
            priority: -1,
          })
        }
      })
    }
  },
})

declare module '@nuxt/schema' {
  interface NuxtConfig {
    vueuse?: VueUseNuxtOptions
  }
  interface NuxtOptions {
    vueuse?: VueUseNuxtOptions
  }
}
