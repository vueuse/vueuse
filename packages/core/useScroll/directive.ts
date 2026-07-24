import type { UseScrollOptions, UseScrollReturn } from '@vueuse/core'
import type { VaporDirective } from 'vue'
import { useScroll } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'

type BindingValueFunction = (state: UseScrollReturn) => void

type BindingValueArray = [BindingValueFunction, UseScrollOptions]
type BindingValue = BindingValueFunction | BindingValueArray

function setupScroll(el: HTMLElement, bindingValue: BindingValue) {
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

export const vScroll = createDisposableDirective<
  HTMLElement,
  BindingValue
>(
  {
    mounted(el, binding) {
      setupScroll(el, binding.value)
    },
  },
)

export const vScrollVapor: VaporDirective = (el, value) => {
  if (!(el instanceof HTMLElement))
    return

  setupScroll(el, value?.() as BindingValue)
}
