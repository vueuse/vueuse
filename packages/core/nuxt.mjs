/* eslint-disable @typescript-eslint/no-var-requires */

const disabled = [
  'useFetch',
  'toRefs',
]

/**
 * Auto import for VueUse in Nuxt
 * Usage:
 *
 * ```ts
 * // nuxt.config.js
 * export deafult {
 *   buildModules: [
 *     '@vueuse/core/nuxt'
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
    config.optimizeDeps.exclude.push(
      '@vueuse/core',
      '@vueuse/shared',
      '@vueuse/integrations',
      '@vueuse/components',
      '@vueuse/motion',
      '@vueuse/firebase',
      '@vueuse/rxjs',
      '@vueuse/sound',
      '@vueuse/head',
    )
  })

  nuxt.hook('autoImports:sources', (sources) => {
    if (sources.find(i => i.from === '@vueuse/core/nuxt'))
      return
    sources.push({
      from: '@vueuse/core',
      names: require('./indexes.json')
        .functions
        .filter(i => (i.package === 'core' || i.package === 'shared') && !i.internal)
        .map(i => i.name)
        .filter(i => i.length >= 4 && !disabled.includes(i)),
    })
  })
}
