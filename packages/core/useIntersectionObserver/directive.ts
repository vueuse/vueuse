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
  let ele = null as unknown as HTMLElement
  return (el, binding) => {
    if (el !== ele) isMounted = false
    if (isMounted) return
    isMounted = true
    ele = el

    if (typeof binding.value === 'function')
      useIntersectionObserver(el, binding.value)
    else
      useIntersectionObserver(el, ...binding.value)
  }
}
export const vIntersectionObserver = vIntersectionObserverHandler()
