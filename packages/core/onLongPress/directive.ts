import type { OnLongPressOptions } from '@vueuse/core'
import type { EffectScope, ObjectDirective } from 'vue'
import { onLongPress } from '@vueuse/core'
import { effectScope } from 'vue'

type BindingValueFunction = (evt: PointerEvent) => void

type BindingValueArray = [
  BindingValueFunction,
  OnLongPressOptions,
]

const vOnLongPressScopes = new WeakMap<HTMLElement, EffectScope>()

export const vOnLongPress: ObjectDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    const scope = vOnLongPressScopes.get(el) ?? effectScope()
    vOnLongPressScopes.set(el, scope)
    scope.run(() => {
      if (typeof binding.value === 'function')
        onLongPress(el, binding.value, { modifiers: binding.modifiers })
      else
        onLongPress(el, ...binding.value)
    })
  },
  unmounted(el) {
    vOnLongPressScopes.get(el)?.stop()
    vOnLongPressScopes.delete(el)
  },
}

/** @deprecated use `vOnLongPress` instead */
export const VOnLongPress = vOnLongPress
