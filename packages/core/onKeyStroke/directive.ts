import type { OnKeyStrokeOptions } from '@vueuse/core'
import type { EffectScope, ObjectDirective } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { effectScope } from 'vue'

type BindingValueFunction = (event: KeyboardEvent) => void

type BindingValueArray = [BindingValueFunction, OnKeyStrokeOptions]

const vOnKeyStrokeScopes = new WeakMap<HTMLElement, EffectScope>()

export const vOnKeyStroke: ObjectDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    const scope = vOnKeyStrokeScopes.get(el) ?? effectScope()
    vOnKeyStrokeScopes.set(el, scope)
    scope.run(() => {
      const keys = binding.arg?.split(',') ?? true
      if (typeof binding.value === 'function') {
        onKeyStroke(keys, binding.value, {
          target: el,
        })
      }
      else {
        const [handler, options] = binding.value
        onKeyStroke(keys, handler, {
          target: el,
          ...options,
        })
      }
    })
  },
  unmounted(el) {
    vOnKeyStrokeScopes.get(el)?.stop()
    vOnKeyStrokeScopes.delete(el)
  },
}
