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
  let ele = null as unknown as HTMLElement
  return (el, binding) => {
    if (el !== ele) isMounted = false
    if (isMounted) return
    isMounted = true
    ele = el

    if (typeof binding.value === 'function')
      useInfiniteScroll(el, binding.value)
    else
      useInfiniteScroll(el, ...binding.value)
  }
}

export const vInfiniteScroll = vInfiniteScrollHandler()
