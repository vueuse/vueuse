import type { FunctionDirective } from 'vue-demi'
import type { LongpressOptions } from '.'
import { onLongpress } from '.'

type BindingValueFunction = (evt: PointerEvent) => void
interface BindingValueObject {
  handler: BindingValueFunction
  options: LongpressOptions
}

export const vOnLongpress: FunctionDirective<
HTMLElement,
BindingValueFunction | BindingValueObject
> = (el, binding) => {
  if (typeof binding.value === 'function') onLongpress(el, binding.value)
  else onLongpress(el, binding.value.handler, binding.value.options)
}
