import type { ObjectDirective } from 'vue-demi'
import { directiveHooks } from '@vueuse/shared'
import type { UseScrollOptions, UseScrollReturn } from '.'
import { useScroll } from '.'

type BindingValueFunction = (state: UseScrollReturn) => void

type BindingValueArray = [BindingValueFunction, UseScrollOptions]

export const vScroll: ObjectDirective<
HTMLElement,
BindingValueFunction | BindingValueArray
> = {
  [directiveHooks.mounted](el, binding) {
    if (typeof binding.value === 'function') {
      const handler = binding.value
      const state = useScroll(el, {
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
      const state = useScroll(el, {
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
