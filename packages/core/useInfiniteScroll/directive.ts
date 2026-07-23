import type { UseInfiniteScrollOptions } from '@vueuse/core'
import type { VaporDirective } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'

type BindingValueFunction = Parameters<typeof useInfiniteScroll>[1]
type BindingValueArray = [BindingValueFunction, UseInfiniteScrollOptions]
type BindingValue = BindingValueFunction | BindingValueArray

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

export const vInfiniteScrollVapor: VaporDirective = (el, value) => {
  if (!(el instanceof HTMLElement))
    return

  const bindingValue = value?.() as BindingValue
  if (typeof bindingValue === 'function')
    useInfiniteScroll(el, bindingValue)
  else
    useInfiniteScroll(el, ...bindingValue)
}
