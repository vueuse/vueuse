import type { UseResizeObserverOptions } from '@vueuse/core'
import type { VaporDirective } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'

type BindingValueFunction = ResizeObserverCallback

type BindingValueArray = [BindingValueFunction, UseResizeObserverOptions]
type BindingValue = BindingValueFunction | BindingValueArray

function setupResizeObserver(el: HTMLElement, bindingValue: BindingValue) {
  if (typeof bindingValue === 'function')
    useResizeObserver(el, bindingValue)
  else
    useResizeObserver(el, ...bindingValue)
}

export const vResizeObserver = createDisposableDirective<
  HTMLElement,
  BindingValue
>(
  {
    mounted(el, binding) {
      setupResizeObserver(el, binding.value)
    },
  },
)

export const vResizeObserverVapor: VaporDirective = (el, value) => {
  if (!(el instanceof HTMLElement))
    return

  setupResizeObserver(el, value?.() as BindingValue)
}
