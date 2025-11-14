import type { UseInfiniteScrollOptions } from '@vueuse/core'
import type { EffectScope, ObjectDirective } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import { effectScope } from 'vue'

type BindingValueFunction = Parameters<typeof useInfiniteScroll>[1]
type BindingValueArray = [BindingValueFunction, UseInfiniteScrollOptions]

const vInfiniteScrollScopes = new WeakMap<HTMLElement, EffectScope>()
export const vInfiniteScroll: ObjectDirective<
  HTMLElement,
BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    const scope = vInfiniteScrollScopes.get(el) ?? effectScope()
    vInfiniteScrollScopes.set(el, scope)
    scope.run(() => {
      if (typeof binding.value === 'function')
        useInfiniteScroll(el, binding.value)
      else
        useInfiniteScroll(el, ...binding.value)
    })
  },
  // unmounted(el) {
  //   vInfiniteScrollScopes.get(el)?.stop()
  //   vInfiniteScrollScopes.delete(el)
  // },
}
