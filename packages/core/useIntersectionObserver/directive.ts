import type { UseIntersectionObserverOptions } from '@vueuse/core'
import type { VaporDirective } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'

type BindingValueFunction = IntersectionObserverCallback

type BindingValueArray = [BindingValueFunction, UseIntersectionObserverOptions]
type BindingValue = BindingValueFunction | BindingValueArray

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

export const vIntersectionObserverVapor: VaporDirective = (el, value) => {
  if (!(el instanceof HTMLElement))
    return

  const bindingValue = value?.() as BindingValue
  if (typeof bindingValue === 'function')
    useIntersectionObserver(el, bindingValue)
  else
    useIntersectionObserver(el, ...bindingValue)
}
