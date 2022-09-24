import { directiveHooks } from '@vueuse/shared'
import type { ObjectDirective } from 'vue-demi'
import type { OnKeyStrokeOptions } from '.'
import { onKeyStroke } from '.'

type BindingValueFunction = (event: KeyboardEvent) => void

type BindingValueArray = [BindingValueFunction, OnKeyStrokeOptions]

export const vOnKeyStroke: ObjectDirective<
HTMLElement,
BindingValueFunction | BindingValueArray
> = {
  [directiveHooks.mounted](el, binding) {
    const keys = binding.arg?.split(',') ?? true
    if (typeof binding.value === 'function') {
      onKeyStroke(keys, binding.value, {
        target: el,
      })
    }
    else {
      const [handler, options] = binding.value
      onKeyStroke(keys, handler, {
        target: el,
        ...options,
      })
    }
  },
}
