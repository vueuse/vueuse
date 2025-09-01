import type { UseScrollOptions, UseScrollReturn } from '@vueuse/core'
import type { ObjectDirective } from 'vue'
import { useScroll } from '@vueuse/core'

type BindingValueFunction = (state: UseScrollReturn) => void

type BindingValueArray = [BindingValueFunction, UseScrollOptions]

export const vScroll: ObjectDirective<
  HTMLElement,
BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
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
