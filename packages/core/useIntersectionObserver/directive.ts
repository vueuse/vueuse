import type { FunctionDirective } from 'vue-demi'
import { useIntersectionObserver } from '.'
import type { IntersectionObserverOptions } from '.'

type BindingValueFunction = IntersectionObserverCallback

type BindingValueArray = [BindingValueFunction, IntersectionObserverOptions]

const vIntersectionObserverHandler = (): FunctionDirective<
HTMLElement,
BindingValueFunction | BindingValueArray
> => {
  let isMounted = false
  return (el, binding) => {
    if (isMounted) return
    isMounted = true
    if (typeof binding.value === 'function')
      useIntersectionObserver(el, binding.value)
    else
      useIntersectionObserver(el, ...binding.value)
  }
}
export const vIntersectionObserver = vIntersectionObserverHandler()
