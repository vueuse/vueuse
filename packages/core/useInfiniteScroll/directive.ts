import type { FunctionDirective } from 'vue-demi'
import { useInfiniteScroll } from '.'
import type { UseInfiniteScrollOptions } from '.'

type BindingValueFunction = Parameters<typeof useInfiniteScroll>[1]

interface BindingValueObject {
  handler: BindingValueFunction
  options: UseInfiniteScrollOptions
}

export const vInfiniteScroll: FunctionDirective<
HTMLElement,
BindingValueFunction | BindingValueObject
> = (el, binding) => {
  if (typeof binding.value === 'function')
    useInfiniteScroll(el, binding.value)
  else
    useInfiniteScroll(el, binding.value.handler, binding.value.options)
}
