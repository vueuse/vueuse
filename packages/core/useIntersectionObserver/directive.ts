import type { UseIntersectionObserverOptions } from '@vueuse/core'
import { useIntersectionObserver } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'

type BindingValueFunction = IntersectionObserverCallback

type BindingValueArray = [BindingValueFunction, UseIntersectionObserverOptions]

export const vIntersectionObserver = createDisposableDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
>(
  {
    mounted(el, binding) {
      if (typeof binding.value === 'function')
        useIntersectionObserver(el, binding.value)
      else
        useIntersectionObserver(el, ...binding.value)
    },
  },
)
