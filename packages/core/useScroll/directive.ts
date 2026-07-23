import type { UseScrollOptions, UseScrollReturn } from '@vueuse/core'
import type { VaporDirective } from 'vue'
import { useScroll } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'

type BindingValueFunction = (state: UseScrollReturn) => void

type BindingValueArray = [BindingValueFunction, UseScrollOptions]
type BindingValue = BindingValueFunction | BindingValueArray

export const vScroll = createDisposableDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
>(
  {
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
  },
)

export const vScrollVapor: VaporDirective = (el, value) => {
  if (!(el instanceof HTMLElement))
    return

  const bindingValue = value?.() as BindingValue
  if (typeof bindingValue === 'function') {
    const state = useScroll(el, {
      onScroll() {
        bindingValue(state)
      },
      onStop() {
        bindingValue(state)
      },
    })
  }
  else {
    const [handler, options] = bindingValue
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
}
