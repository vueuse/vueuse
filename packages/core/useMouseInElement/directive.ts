import type { ObjectDirective, Reactive } from 'vue'
import type { MouseInElementOptions, UseMouseInElementReturn } from '.'
import { reactiveOmit } from '@vueuse/shared'
import { reactive, watch } from 'vue'
import { useMouseInElement } from '.'

type MouseInElement = Omit<UseMouseInElementReturn, 'stop'>
type BindingValueFunction = (mouse: Reactive<MouseInElement>) => void
type BindingValueArray = [BindingValueFunction, MouseInElementOptions]

export const vMouseInElement: ObjectDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    const [handler, options] = (typeof binding.value === 'function' ? [binding.value, {}] : binding.value) as BindingValueArray

    const state = reactiveOmit(reactive(useMouseInElement(el, options)), 'stop')
    watch(state, val => handler(val))
  },
}
