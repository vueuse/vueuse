import type { FunctionDirective } from 'vue-demi'
import { useIntersectionObserver } from '.'
import type { IntersectionObserverOptions } from '.'

type BindingValueFunction = IntersectionObserverCallback

type BindingValueArray = [BindingValueFunction, IntersectionObserverOptions]

const vIntersectionObserverHandler = (): FunctionDirective<
HTMLElement,
BindingValueFunction | BindingValueArray
> => {
  let mountedEle: HTMLElement | null = null
  return (el, binding) => {
    if (el === mountedEle) return
    mountedEle = el

    if (typeof binding.value === 'function')
      useIntersectionObserver(el, binding.value)
    else
      useIntersectionObserver(el, ...binding.value)
  }
}
export const vIntersectionObserver = vIntersectionObserverHandler()
