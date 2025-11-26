import type { UseIntersectionObserverOptions } from '@vueuse/core'
import type { EffectScope, ObjectDirective } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { effectScope } from 'vue'

type BindingValueFunction = IntersectionObserverCallback

type BindingValueArray = [BindingValueFunction, UseIntersectionObserverOptions]

const vIntersectionObserverScopes = new WeakMap<HTMLElement, EffectScope>()

export const vIntersectionObserver: ObjectDirective<
  HTMLElement,
BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    const scope = vIntersectionObserverScopes.get(el) ?? effectScope()
    vIntersectionObserverScopes.set(el, scope)
    scope.run(() => {
      if (typeof binding.value === 'function')
        useIntersectionObserver(el, binding.value)
      else
        useIntersectionObserver(el, ...binding.value)
    })
  },
  unmounted(el) {
    vIntersectionObserverScopes.get(el)?.stop()
    vIntersectionObserverScopes.delete(el)
  },
}
