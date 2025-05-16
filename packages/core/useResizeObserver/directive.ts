import type { ObjectDirective } from 'vue'
import type { ResizeObserverCallback, UseResizeObserverOptions } from './index'
import { useResizeObserver } from './index'

type BindingValueFunction = ResizeObserverCallback

type BindingValueArray = [BindingValueFunction, UseResizeObserverOptions]

export const vResizeObserver: ObjectDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    if (typeof binding.value === 'function')
      useResizeObserver(el, binding.value)
    else
      useResizeObserver(el, ...binding.value)
  },
}
