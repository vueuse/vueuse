import type { MouseInElementOptions, UseMouseInElementReturn } from '@vueuse/core'
import type { Reactive, VaporDirective } from 'vue'
import { useMouseInElement } from '@vueuse/core'
import { createDisposableDirective, reactiveOmit } from '@vueuse/shared'
import { reactive, watch } from 'vue'

type MouseInElement = Omit<UseMouseInElementReturn, 'stop'>
type BindingValueFunction = (mouse: Reactive<MouseInElement>) => void
type BindingValueArray = [BindingValueFunction, MouseInElementOptions]
type BindingValue = BindingValueFunction | BindingValueArray

function setupMouseInElement(el: HTMLElement, bindingValue: BindingValue) {
  const [handler, options] = (typeof bindingValue === 'function' ? [bindingValue, {}] : bindingValue) as BindingValueArray
  const state = reactiveOmit(reactive(useMouseInElement(el, options)), 'stop')
  watch(state, val => handler(val))
}

export const vMouseInElement = createDisposableDirective<
  HTMLElement,
  BindingValue
>(
  {
    mounted(el, binding) {
      setupMouseInElement(el, binding.value)
    },
  },
)

export const vMouseInElementVapor: VaporDirective = (el, value) => {
  if (!(el instanceof HTMLElement))
    return

  setupMouseInElement(el, value?.() as BindingValue)
}
