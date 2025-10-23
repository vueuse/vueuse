import type { UseIntersectionObserverOptions } from '@vueuse/core'
import type { ObjectDirective } from 'vue'
import { isFunction, useIntersectionObserver } from '@vueuse/core'

type BindingValueFunction = IntersectionObserverCallback

type BindingValueArray = [BindingValueFunction, UseIntersectionObserverOptions]

export const vIntersectionObserver: ObjectDirective<
  HTMLElement,
BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    if (isFunction(binding.value))
      useIntersectionObserver(el, binding.value)
    else
      useIntersectionObserver(el, ...binding.value)
  },
}
