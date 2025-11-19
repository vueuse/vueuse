import type { UseElementVisibilityOptions } from '@vueuse/core'
import type { EffectScope, ObjectDirective } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import { effectScope, watch } from 'vue'

type BindingValueFunction = (state: boolean) => void

type BindingValueArray = [BindingValueFunction, UseElementVisibilityOptions]

const vElementVisibilityScopes = new WeakMap<HTMLElement, EffectScope>()

export const vElementVisibility: ObjectDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    const scope = vElementVisibilityScopes.get(el) ?? effectScope()
    vElementVisibilityScopes.set(el, scope)
    scope.run(() => {
      if (typeof binding.value === 'function') {
        const handler = binding.value
        const isVisible = useElementVisibility(el)
        watch(isVisible, v => handler(v), { immediate: true })
      }
      else {
        const [handler, options] = binding.value
        const isVisible = useElementVisibility(el, options)
        watch(isVisible, v => handler(v), { immediate: true })
      }
    })
  },
  unmounted(el) {
    vElementVisibilityScopes.get(el)?.stop()
    vElementVisibilityScopes.delete(el)
  },
}
