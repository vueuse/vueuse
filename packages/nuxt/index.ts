import type { Import, Preset } from 'unimport'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtModule } from '@nuxt/kit'
import { metadata } from '@vueuse/metadata'
import { isPackageExists } from 'local-pkg'

const _dirname = dirname(fileURLToPath(import.meta.url))

const disabledFunctions = [
  // Vue 3 built-in
  'toRefs',
  'toRef',
  'toValue',

  // Nuxt built-in
  'useFetch',
  'useCookie',
  'useHead',
  'useStorage',
  'useImage',
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
  'router',
]

const fullPackages = packages.map(p => `@vueuse/${p}`)

export interface VueUseNuxtOptions {
  /**
   * @default true
   */
  autoImports?: boolean

  /**
   * @experimental
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
 * export default {
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
      for (const pkg of fullPackages) {
        if (!config.optimizeDeps.exclude.includes(pkg))
          config.optimizeDeps.exclude.push(pkg)
      }
    })

    // add packages to transpile target for alias resolution
    nuxt.options.build = nuxt.options.build || {}
    nuxt.options.build.transpile = nuxt.options.build.transpile || []
    nuxt.options.build.transpile.push(...fullPackages)

    if (options.ssrHandlers) {
      const pluginPath = resolve(_dirname, './ssr-plugin.mjs')
      nuxt.options.plugins = nuxt.options.plugins || []
      nuxt.options.plugins.push(pluginPath)
      nuxt.options.build.transpile.push(pluginPath)
    }

    // @ts-expect-error - private API
    nuxt.hook('devtools:customTabs', (iframeTabs) => {
      iframeTabs.push({
        name: 'vueuse',
        title: 'VueUse',
        icon: 'i-logos-vueuse',
        view: {
          type: 'iframe',
          src: 'https://vueuse.org/functions.html',
        },
      })
    })

    if (options.autoImports) {
      // auto import functions
      nuxt.hook('imports:sources', (sources: (Import | Preset)[]) => {
        if (sources.find(i => fullPackages.includes((i as Import).from)))
          return

        metadata.functions.forEach((i) => {
          if (i.package === 'shared')
            i.package = 'core'
        })

        for (const pkg of packages) {
          if (pkg === 'shared')
            continue

          if (pkg !== 'core' && !isPackageExists(
            `@vueuse/${pkg}`,
            { paths: nuxt.options._layers.map(layer => layer.config.rootDir) },
          )) {
            continue
          }

          const imports = metadata
            .functions
            .filter(i => i.package === pkg
              && !i.internal
              && i.name.length >= 4
              && !disabledFunctions.includes(i.name),
            )
            .flatMap((i): Import[] => {
              const names = [i.name, ...i.alias || [], ...i.variants || []]
              return names.map(n => ({
                from: `@vueuse/${i.importPath || i.package}`,
                name: n,
                as: n,
                priority: -1,
                meta: {
                  description: i.description,
                  docsUrl: i.docs,
                  category: i.category,
                },
              }))
            })

          sources.push({
            from: '@vueuse/core',
            imports,
            priority: -1,
          })
        }

        // Auto-import directives from @vueuse/components if installed
        if (isPackageExists(
          '@vueuse/components',
          { paths: nuxt.options._layers.map(layer => layer.config.rootDir) },
        )) {
          const directiveImports = metadata
            .functions
            .filter(i => i.directive && !i.internal)
            .map((i): Import => {
              // Convert function name to directive name
              // onClickOutside -> vOnClickOutside
              // useElementSize -> vElementSize
              const directiveName = i.name.startsWith('on')
                ? `v${i.name.charAt(0).toUpperCase()}${i.name.slice(1)}`
                : `v${i.name.replace(/^use/, '')}`

              return {
                from: '@vueuse/components',
                name: directiveName,
                as: directiveName,
                priority: -1,
                meta: {
                  description: `Directive version of ${i.name}`,
                  docsUrl: i.docs,
                  category: i.category,
                },
              }
            })

          if (directiveImports.length > 0) {
            sources.push({
              from: '@vueuse/components',
              imports: directiveImports,
              priority: -1,
            })
          }
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
