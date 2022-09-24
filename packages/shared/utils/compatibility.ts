import { isVue3 } from 'vue-demi'

export function __onlyVue3(name = 'this function') {
  if (isVue3)
    return

  throw new Error(`[VueUse] ${name} is only works on Vue 3.`)
}

export const directiveHooks = {
  mounted: (isVue3 ? 'mounted' : 'inserted') as 'mounted',
  updated: (isVue3 ? 'updated' : 'componentUpdated') as 'updated',
  unmounted: (isVue3 ? 'unmounted' : 'unbind') as 'unmounted',
}
