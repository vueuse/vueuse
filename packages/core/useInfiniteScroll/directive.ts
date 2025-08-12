import type { UseInfiniteScrollOptions } from '@vueuse/core'
import type { ObjectDirective } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'

type BindingValueFunction = Parameters<typeof useInfiniteScroll>[1]
type BindingValueArray = [BindingValueFunction, UseInfiniteScrollOptions]

export const vInfiniteScroll: ObjectDirective<
  HTMLElement,
BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    if (typeof binding.value === 'function')
      useInfiniteScroll(el, binding.value)
    else
      useInfiniteScroll(el, ...binding.value)
  },
}
