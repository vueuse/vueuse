import fs from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const disabled = [
  'useFetch',
  'toRefs',
  'useCookie',
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

  // eslint-disable-next-line no-console
  console.log('[@vueuse/core] Installing Nuxt module with `@vueuse/core/nuxt` is deprecated. Please use `@vueuse/nuxt` instead.')

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
    const indexes = JSON.parse(fs.readFileSync(resolve(__dirname, './indexes.json'), 'utf-8'))
    sources.push({
      from: '@vueuse/core',
      names: indexes
        .functions
        .filter(i => (i.package === 'core' || i.package === 'shared') && !i.internal)
        .map(i => i.name)
        .filter(i => i.length >= 4 && !disabled.includes(i)),
    })
  })
}
