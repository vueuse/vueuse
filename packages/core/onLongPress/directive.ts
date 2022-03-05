import type { FunctionDirective } from 'vue-demi'
import type { OnLongPressOptions } from '.'
import { onLongPress } from '.'

type BindingValueFunction = (evt: PointerEvent) => void

type BindingValueArray = [
  BindingValueFunction,
  OnLongPressOptions,
]

export const VOnLongPress: FunctionDirective<
HTMLElement,
BindingValueFunction | BindingValueArray
> = (el, binding) => {
  if (typeof binding.value === 'function')
    onLongPress(el, binding.value)
  else
    onLongPress(el, ...binding.value)
}
