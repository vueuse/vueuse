import { isVue3 } from 'vue-demi'

export const directiveHooks = {
  mounted: (isVue3 ? 'mounted' : 'inserted') as 'mounted',
  updated: (isVue3 ? 'updated' : 'componentUpdated') as 'updated',
  unmounted: (isVue3 ? 'unmounted' : 'unbind') as 'unmounted',
}
