import type { FunctionDirective } from 'vue-demi'
import { useInfiniteScroll } from '.'
import type { UseInfiniteScrollOptions } from '.'

type BindingValueFunction = Parameters<typeof useInfiniteScroll>[1]
type BindingValueArray = [BindingValueFunction, UseInfiniteScrollOptions]

export const vInfiniteScrollHandler = (): FunctionDirective<
HTMLElement,
BindingValueFunction | BindingValueArray
> => {
  let isMounted = false
  return (el, binding) => {
    if (isMounted) return
    isMounted = true
    if (typeof binding.value === 'function')
      useInfiniteScroll(el, binding.value)
    else
      useInfiniteScroll(el, ...binding.value)
  }
}

export const vInfiniteScroll = vInfiniteScrollHandler()
