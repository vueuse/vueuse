import type { ObjectDirective } from 'vue-demi'
import type { UseIntersectionObserverOptions } from '.'
import { directiveHooks } from '@vueuse/shared'
import { useIntersectionObserver } from '.'

type BindingValueFunction = IntersectionObserverCallback

type BindingValueArray = [BindingValueFunction, UseIntersectionObserverOptions]

export const vIntersectionObserver: ObjectDirective<
  HTMLElement,
BindingValueFunction | BindingValueArray
> = {
  [directiveHooks.mounted](el, binding) {
    if (typeof binding.value === 'function')
      useIntersectionObserver(el, binding.value)
    else
      useIntersectionObserver(el, ...binding.value)
  },
}
