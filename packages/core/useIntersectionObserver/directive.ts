import { directiveHooks } from '@vueuse/shared'
import type { ObjectDirective } from 'vue-demi'
import { useIntersectionObserver } from '.'
import type { IntersectionObserverOptions } from '.'

type BindingValueFunction = IntersectionObserverCallback

type BindingValueArray = [BindingValueFunction, IntersectionObserverOptions]

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
