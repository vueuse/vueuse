import type { OnLongPressOptions } from '@vueuse/core'
import { onLongPress } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'

type BindingValueFunction = (evt: PointerEvent) => void

type BindingValueArray = [
  BindingValueFunction,
  OnLongPressOptions,
]

export const vOnLongPress = createDisposableDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
> (
  {
    mounted(el, binding) {
      if (typeof binding.value === 'function')
        onLongPress(el, binding.value, { modifiers: binding.modifiers })
      else
        onLongPress(el, ...binding.value)
    },
  },
)

/** @deprecated use `vOnLongPress` instead */
export const VOnLongPress = vOnLongPress
