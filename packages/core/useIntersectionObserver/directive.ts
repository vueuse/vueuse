import type { UseIntersectionObserverOptions } from '@vueuse/core'
import type { VaporDirective } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'

type BindingValueFunction = IntersectionObserverCallback

type BindingValueArray = [BindingValueFunction, UseIntersectionObserverOptions]
type BindingValue = BindingValueFunction | BindingValueArray

function setupIntersectionObserver(el: HTMLElement, bindingValue: BindingValue) {
  if (typeof bindingValue === 'function')
    useIntersectionObserver(el, bindingValue)
  else
    useIntersectionObserver(el, ...bindingValue)
}

export const vIntersectionObserver = createDisposableDirective<
  HTMLElement,
  BindingValue
>(
  {
    mounted(el, binding) {
      setupIntersectionObserver(el, binding.value)
    },
  },
)

export const vIntersectionObserverVapor: VaporDirective = (el, value) => {
  if (!(el instanceof HTMLElement))
    return

  setupIntersectionObserver(el, value?.() as BindingValue)
}
