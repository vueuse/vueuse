import type { EffectScope, ObjectDirective, Reactive } from 'vue'
import type { MouseInElementOptions, UseMouseInElementReturn } from './index'
import { reactiveOmit } from '@vueuse/shared'
import { effectScope, reactive, watch } from 'vue'
import { useMouseInElement } from './index'

type MouseInElement = Omit<UseMouseInElementReturn, 'stop'>
type BindingValueFunction = (mouse: Reactive<MouseInElement>) => void
type BindingValueArray = [BindingValueFunction, MouseInElementOptions]

export const vMouseInElement: ObjectDirective<
  HTMLElement & { _scope: EffectScope | null },
  BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    const scope = effectScope()
    el._scope = scope
    el._scope.run(() => {
      const [handler, options] = (typeof binding.value === 'function' ? [binding.value, {}] : binding.value) as BindingValueArray

      const state = reactiveOmit(reactive(useMouseInElement(el, options)), 'stop')
      watch(state, val => handler(val))
    })
  },
  unmounted(el) {
    el._scope?.stop()
    el._scope = null
  },
}
