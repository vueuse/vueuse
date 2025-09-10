import type { OnLongPressOptions } from '@vueuse/core'
import type { ObjectDirective } from 'vue'
import { onLongPress } from '@vueuse/core'

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

/** @deprecated use `vOnLongPress` instead */
export const VOnLongPress = vOnLongPress
