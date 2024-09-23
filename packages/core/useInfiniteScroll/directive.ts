import type { ObjectDirective } from 'vue-demi'
import type { UseInfiniteScrollOptions } from '.'
import { directiveHooks } from '@vueuse/shared'
import { useInfiniteScroll } from '.'

type BindingValueFunction = Parameters<typeof useInfiniteScroll>[1]
type BindingValueArray = [BindingValueFunction, UseInfiniteScrollOptions]

export const vInfiniteScroll: ObjectDirective<
  HTMLElement,
BindingValueFunction | BindingValueArray
> = {
  [directiveHooks.mounted](el, binding) {
    if (typeof binding.value === 'function')
      useInfiniteScroll(el, binding.value)
    else
      useInfiniteScroll(el, ...binding.value)
  },
}
