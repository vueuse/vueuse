import type { ObjectDirective } from 'vue-demi'
import { directiveHooks } from '@vueuse/shared'
import type { UseScrollProgressOptions, UseScrollProgressReturn } from '.'
import { useScrollProgress } from '.'

type BindingValueFunction = (state: UseScrollProgressReturn) => void

type BindingValueArray = [BindingValueFunction, UseScrollProgressOptions]

export const vScrollProgress: ObjectDirective<
  HTMLElement,
  BindingValueArray | BindingValueFunction
> = {
  [directiveHooks.mounted](el, binding) {
    if (typeof binding.value === 'function') {
      const handler = binding.value
      const state = useScrollProgress(el, {
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
      const state = useScrollProgress(el, {
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
