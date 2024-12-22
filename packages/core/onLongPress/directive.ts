import type { ObjectDirective } from 'vue'
import type { OnLongPressOptions } from '.'

import { onLongPress } from '.'

type BindingValueFunction = (evt: PointerEvent) => void

type BindingValueArray = [
  BindingValueFunction,
  OnLongPressOptions,
]

export const vOnLongPress: ObjectDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    if (typeof binding.value === 'function')
      onLongPress(el, binding.value, { modifiers: binding.modifiers })
    else
      onLongPress(el, ...binding.value)
  },
}

// alias
export { vOnLongPress as VOnLongPress }
