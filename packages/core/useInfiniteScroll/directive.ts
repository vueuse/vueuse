import type { UseInfiniteScrollOptions } from '@vueuse/core'
import type { VaporDirective } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'

type BindingValueFunction = Parameters<typeof useInfiniteScroll>[1]
type BindingValueArray = [BindingValueFunction, UseInfiniteScrollOptions]
type BindingValue = BindingValueFunction | BindingValueArray

function setupInfiniteScroll(el: HTMLElement, bindingValue: BindingValue) {
  if (typeof bindingValue === 'function')
    useInfiniteScroll(el, bindingValue)
  else
    useInfiniteScroll(el, ...bindingValue)
}

export const vInfiniteScroll = createDisposableDirective<
  HTMLElement,
  BindingValue
>(
  {
    mounted(el, binding) {
      setupInfiniteScroll(el, binding.value)
    },
  },
)

export const vInfiniteScrollVapor: VaporDirective = (el, value) => {
  if (!(el instanceof HTMLElement))
    return

  setupInfiniteScroll(el, value?.() as BindingValue)
}
