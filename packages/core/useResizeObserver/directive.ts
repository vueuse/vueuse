import type { UseResizeObserverOptions } from '@vueuse/core'
import { useResizeObserver } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'

type BindingValueFunction = ResizeObserverCallback

type BindingValueArray = [BindingValueFunction, UseResizeObserverOptions]

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
