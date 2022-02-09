import type { FunctionDirective } from 'vue-demi'
import type { OnLongPressOptions } from '.'
import { onLongPress } from '.'

type BindingValueFunction = (evt: PointerEvent) => void

interface BindingValueObject {
  handler: BindingValueFunction
  options: OnLongPressOptions
}

export const VOnLongPress: FunctionDirective<
HTMLElement,
BindingValueFunction | BindingValueObject
> = (el, binding) => {
  if (typeof binding.value === 'function')
    onLongPress(el, binding.value)
  else
    onLongPress(el, binding.value.handler, binding.value.options)
}
