/* eslint-disable @typescript-eslint/no-var-requires */

const disabled = [
  'useFetch',
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
module.exports = function() {
  const { nuxt } = this

  nuxt.hook('autoImports:sources', (sources) => {
    sources.push({
      from: '@vueuse/core',
      names: require('./indexes.json')
        .functions
        .filter(i => (i.package === 'core' || i.package === 'shared') && !i.internal)
        .map(i => i.name)
        .filter(i => i.length < 4 && !disabled.includes(i)),
    })
  })
}
