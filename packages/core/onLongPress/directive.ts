import type { OnLongPressModifiers, OnLongPressOptions } from '@vueuse/core'
import type { VaporDirective } from 'vue'
import { onLongPress } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'

type BindingValueFunction = (evt: PointerEvent) => void

type BindingValueArray = [
  BindingValueFunction,
  OnLongPressOptions,
]
type BindingValue = BindingValueFunction | BindingValueArray

function setupOnLongPress(
  el: HTMLElement,
  bindingValue: BindingValue,
  modifiers: OnLongPressOptions['modifiers'] = {},
) {
  if (typeof bindingValue === 'function')
    onLongPress(el, bindingValue, { modifiers })
  else
    onLongPress(el, ...bindingValue)
}

export const vOnLongPress = createDisposableDirective<
  HTMLElement,
  BindingValue
> (
  {
    mounted(el, binding) {
      setupOnLongPress(el, binding.value, binding.modifiers)
    },
  },
)

export const vOnLongPressVapor: VaporDirective<HTMLElement, BindingValue, keyof OnLongPressModifiers> = (el, value, _, modifiers) => {
  setupOnLongPress(el, value!(), modifiers)
}

/** @deprecated use `vOnLongPress` instead */
export const VOnLongPress = vOnLongPress
