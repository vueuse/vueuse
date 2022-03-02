import type { FunctionDirective } from 'vue-demi'
import { useIntersectionObserver } from '.'
import type { IntersectionObserverOptions } from '.'

type BindingValueFunction = IntersectionObserverCallback

interface BindingValueObject {
  handler: BindingValueFunction
  options: IntersectionObserverOptions
}

export const vIntersectionObserver: FunctionDirective<
HTMLElement,
BindingValueFunction | BindingValueObject
> = (el, binding) => {
  if (typeof binding.value === 'function')
    useIntersectionObserver(el, binding.value)
  else
    useIntersectionObserver(el, binding.value.handler, binding.value.options)
}
