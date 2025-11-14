import type { ResizeObserverCallback, UseResizeObserverOptions } from '@vueuse/core'
import type { EffectScope, ObjectDirective } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { effectScope } from 'vue'

type BindingValueFunction = ResizeObserverCallback

type BindingValueArray = [BindingValueFunction, UseResizeObserverOptions]

const vResizeObserverScopes = new WeakMap<HTMLElement, EffectScope>()

export const vResizeObserver: ObjectDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    const scope = vResizeObserverScopes.get(el) ?? effectScope()
    vResizeObserverScopes.set(el, scope)
    scope.run(() => {
      if (typeof binding.value === 'function')
        useResizeObserver(el, binding.value)
      else
        useResizeObserver(el, ...binding.value)
    })
  },
  unmounted(el) {
    vResizeObserverScopes.get(el)?.stop()
    vResizeObserverScopes.delete(el)
  },
}
