import type { ObjectDirective } from 'vue-demi'
import { directiveHooks } from '@vueuse/shared'
import type { UseScrollValueOptions, UseScrollValuesReturn } from '.'
import { useScrollValues } from '.'

type BindingValueFunction = (state: UseScrollValuesReturn) => void

type BindingValueArray = [BindingValueFunction, UseScrollValueOptions]

export const vScrollValue: ObjectDirective<
HTMLElement,
BindingValueFunction | BindingValueArray
> = {
  [directiveHooks.mounted](el, binding) {
    if (typeof binding.value === 'function') {
      const handler = binding.value
      const state = useScrollValues(el, {
        onScroll() {
          handler(state)
        },
        onStop() {
          handler(state)
        },
      })
    }
    else {
      const [handler, options] = binding.value
      const state = useScrollValues(el, {
        ...options,
        onScroll(e) {
          options.onScroll?.(e)
          handler(state)
        },
        onStop(e) {
          options.onStop?.(e)
          handler(state)
        },
      })
    }
  },
}
