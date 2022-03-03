import type { FunctionDirective } from 'vue-demi'
import { useIntersectionObserver } from '.'
import type { IntersectionObserverOptions } from '.'

type BindingValueFunction = IntersectionObserverCallback

type BindingValueArray = [BindingValueFunction, IntersectionObserverOptions]

export const vIntersectionObserver: FunctionDirective<
HTMLElement,
BindingValueFunction | BindingValueArray
> = (el, binding) => {
  if (typeof binding.value === 'function')
    useIntersectionObserver(el, binding.value)
  else
    useIntersectionObserver(el, ...binding.value)
}
