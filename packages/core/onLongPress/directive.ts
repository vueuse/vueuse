import type { OnLongPressOptions } from '@vueuse/core'
import type { VaporDirective } from 'vue'
import { onLongPress } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'

type BindingValueFunction = (evt: PointerEvent) => void

type BindingValueArray = [
  BindingValueFunction,
  OnLongPressOptions,
]
type BindingValue = BindingValueFunction | BindingValueArray

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

export const vOnLongPressVapor: VaporDirective = (el, value, _, modifiers) => {
  if (!(el instanceof HTMLElement))
    return

  const bindingValue = value?.() as BindingValue
  if (typeof bindingValue === 'function')
    onLongPress(el, bindingValue, { modifiers: modifiers ?? {} })
  else
    onLongPress(el, ...bindingValue)
}

/** @deprecated use `vOnLongPress` instead */
export const VOnLongPress = vOnLongPress
