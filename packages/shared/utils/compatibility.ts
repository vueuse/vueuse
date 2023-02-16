import { isVue3, version } from 'vue-demi'

export function __onlyVue3(name = 'this function') {
  if (isVue3)
    return

  throw new Error(`[VueUse] ${name} is only works on Vue 3.`)
}

export function __onlyVue27Plus(name = 'this function') {
  if (isVue3 || version.startsWith('2.7.'))
    return

  throw new Error(`[VueUse] ${name} is only works on Vue 2.7 or above.`)
}

export const directiveHooks = {
  mounted: (isVue3 ? 'mounted' : 'inserted') as 'mounted',
  updated: (isVue3 ? 'updated' : 'componentUpdated') as 'updated',
  unmounted: (isVue3 ? 'unmounted' : 'unbind') as 'unmounted',
}
