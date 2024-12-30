import type { ObjectDirective } from 'vue'
import type { MouseInElementOptions, UseMouseInElementReturn } from '.'
import { reactiveOmit } from '@vueuse/shared'
import { watch } from 'vue'
import { useMouseInElement } from '.'

type MouseInElement = Omit<UseMouseInElementReturn, 'stop'>
type BindingValueFunction = (mouse: MouseInElement) => void
type BindingValueArray = [BindingValueFunction, MouseInElementOptions]

export const vMouseInElement: ObjectDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    const [handler, options] = (typeof binding.value === 'function' ? [binding.value, {}] : binding.value) as BindingValueArray

    const state = reactiveOmit(useMouseInElement(el, options), 'stop') as MouseInElement
    watch(state, val => handler(val))
  },
}
