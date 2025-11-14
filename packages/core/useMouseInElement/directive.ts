import type { MouseInElementOptions, UseMouseInElementReturn } from '@vueuse/core'
import type { EffectScope, ObjectDirective, Reactive } from 'vue'
import { useMouseInElement } from '@vueuse/core'
import { reactiveOmit } from '@vueuse/shared'
import { effectScope, reactive, watch } from 'vue'

type MouseInElement = Omit<UseMouseInElementReturn, 'stop'>
type BindingValueFunction = (mouse: Reactive<MouseInElement>) => void
type BindingValueArray = [BindingValueFunction, MouseInElementOptions]

const vMouseInElementScopes = new WeakMap<HTMLElement, EffectScope>()

export const vMouseInElement: ObjectDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    const scope = vMouseInElementScopes.get(el) ?? effectScope()
    vMouseInElementScopes.set(el, scope)
    scope.run(() => {
      const [handler, options] = (typeof binding.value === 'function' ? [binding.value, {}] : binding.value) as BindingValueArray

      const state = reactiveOmit(reactive(useMouseInElement(el, options)), 'stop')
      watch(state, val => handler(val))
    })
  },
  unmounted(el) {
    vMouseInElementScopes.get(el)?.stop()
    vMouseInElementScopes.delete(el)
  },
}
