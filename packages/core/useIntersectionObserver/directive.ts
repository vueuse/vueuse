import type { ObjectDirective } from 'vue'
import type { UseIntersectionObserverOptions } from '.'
import { useIntersectionObserver } from '.'

type BindingValueFunction = IntersectionObserverCallback

type BindingValueArray = [BindingValueFunction, UseIntersectionObserverOptions]

export const vIntersectionObserver: ObjectDirective<
  HTMLElement,
BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    if (typeof binding.value === 'function')
      useIntersectionObserver(el, binding.value)
    else
      useIntersectionObserver(el, ...binding.value)
  },
}
