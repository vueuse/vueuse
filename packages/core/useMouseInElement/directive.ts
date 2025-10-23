import type { MouseInElementOptions, UseMouseInElementReturn } from '@vueuse/core'
import type { ObjectDirective, Reactive } from 'vue'
import { useMouseInElement } from '@vueuse/core'
import { isFunction, reactiveOmit } from '@vueuse/shared'
import { reactive, watch } from 'vue'

type MouseInElement = Omit<UseMouseInElementReturn, 'stop'>
type BindingValueFunction = (mouse: Reactive<MouseInElement>) => void
type BindingValueArray = [BindingValueFunction, MouseInElementOptions]

export const vMouseInElement: ObjectDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    const [handler, options] = (isFunction(binding.value) ? [binding.value, {}] : binding.value) as BindingValueArray

    const state = reactiveOmit(reactive(useMouseInElement(el, options)), 'stop')
    watch(state, val => handler(val))
  },
}
