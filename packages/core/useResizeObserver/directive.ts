import type { UseResizeObserverOptions } from '@vueuse/core'
import type { VaporDirective } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'

type BindingValueFunction = ResizeObserverCallback

type BindingValueArray = [BindingValueFunction, UseResizeObserverOptions]
type BindingValue = BindingValueFunction | BindingValueArray

export const vResizeObserver = createDisposableDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
>(
  {
    mounted(el, binding) {
      if (typeof binding.value === 'function')
        useResizeObserver(el, binding.value)
      else
        useResizeObserver(el, ...binding.value)
    },
  },
)

export const vResizeObserverVapor: VaporDirective = (el, value) => {
  if (!(el instanceof HTMLElement))
    return

  const bindingValue = value?.() as BindingValue
  if (typeof bindingValue === 'function')
    useResizeObserver(el, bindingValue)
  else
    useResizeObserver(el, ...bindingValue)
}
