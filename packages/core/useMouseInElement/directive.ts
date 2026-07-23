import type { MouseInElementOptions, UseMouseInElementReturn } from '@vueuse/core'
import type { Reactive, VaporDirective } from 'vue'
import { useMouseInElement } from '@vueuse/core'
import { createDisposableDirective, reactiveOmit } from '@vueuse/shared'
import { reactive, watch } from 'vue'

type MouseInElement = Omit<UseMouseInElementReturn, 'stop'>
type BindingValueFunction = (mouse: Reactive<MouseInElement>) => void
type BindingValueArray = [BindingValueFunction, MouseInElementOptions]

export const vMouseInElement = createDisposableDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
>(
  {
    mounted(el, binding) {
      const [handler, options] = (typeof binding.value === 'function' ? [binding.value, {}] : binding.value) as BindingValueArray

      const state = reactiveOmit(reactive(useMouseInElement(el, options)), 'stop')
      watch(state, val => handler(val))
    },
  },
)

export const vMouseInElementVapor: VaporDirective = (el, value) => {
  if (!(el instanceof HTMLElement))
    return

  const bindingValue = value?.() as BindingValueFunction | BindingValueArray
  const [handler, options] = (typeof bindingValue === 'function' ? [bindingValue, {}] : bindingValue) as BindingValueArray
  const state = reactiveOmit(reactive(useMouseInElement(el, options)), 'stop')
  watch(state, val => handler(val))
}
