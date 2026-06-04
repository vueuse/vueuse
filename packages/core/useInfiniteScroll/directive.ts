import type { UseInfiniteScrollOptions } from '@vueuse/core'
import { useInfiniteScroll } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'

type BindingValueFunction = Parameters<typeof useInfiniteScroll>[1]
type BindingValueArray = [BindingValueFunction, UseInfiniteScrollOptions]

export const vInfiniteScroll = createDisposableDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
>(
  {
    mounted(el, binding) {
      if (typeof binding.value === 'function')
        useInfiniteScroll(el, binding.value)
      else
        useInfiniteScroll(el, ...binding.value)
    },
  },
)
