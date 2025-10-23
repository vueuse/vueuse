import type { UseInfiniteScrollOptions } from '@vueuse/core'
import type { ObjectDirective } from 'vue'
import { isFunction, useInfiniteScroll } from '@vueuse/core'

type BindingValueFunction = Parameters<typeof useInfiniteScroll>[1]
type BindingValueArray = [BindingValueFunction, UseInfiniteScrollOptions]

export const vInfiniteScroll: ObjectDirective<
  HTMLElement,
BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    if (isFunction(binding.value))
      useInfiniteScroll(el, binding.value)
    else
      useInfiniteScroll(el, ...binding.value)
  },
}
