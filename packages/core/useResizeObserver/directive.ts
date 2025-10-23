import type { ResizeObserverCallback, UseResizeObserverOptions } from '@vueuse/core'
import type { ObjectDirective } from 'vue'
import { isFunction, useResizeObserver } from '@vueuse/core'

type BindingValueFunction = ResizeObserverCallback

type BindingValueArray = [BindingValueFunction, UseResizeObserverOptions]

export const vResizeObserver: ObjectDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    if (isFunction(binding.value))
      useResizeObserver(el, binding.value)
    else
      useResizeObserver(el, ...binding.value)
  },
}
