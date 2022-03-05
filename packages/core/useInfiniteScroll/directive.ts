import type { FunctionDirective } from 'vue-demi'
import { useInfiniteScroll } from '.'
import type { UseInfiniteScrollOptions } from '.'

type BindingValueFunction = Parameters<typeof useInfiniteScroll>[1]
type BindingValueArray = [BindingValueFunction, UseInfiniteScrollOptions]

export const vInfiniteScroll: FunctionDirective<
HTMLElement,
BindingValueFunction | BindingValueArray
> = (el, binding) => {
  if (typeof binding.value === 'function')
    useInfiniteScroll(el, binding.value)
  else
    useInfiniteScroll(el, ...binding.value)
}
