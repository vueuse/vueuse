import type { VueUseFunction } from './types'

export const head: VueUseFunction[] = [
  {
    name: 'createHead',
    package: 'head',
    lastUpdated: 0,
    description: 'Create the head manager instance.',
    category: '@Head',
    external: 'https://github.com/vueuse/head#api',
  },
  {
    name: 'useHead',
    package: 'head',
    lastUpdated: 0,
    description: 'Update head meta tags reactively.',
    category: '@Head',
    external: 'https://github.com/vueuse/head#api',
  },
]

export const ecosystemFunctions = [
  ...head,
]
