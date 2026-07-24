import type { UseElementHoverOptions } from '@vueuse/core'
import type { VaporDirective } from 'vue'
import { useElementHover } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'
import { watch } from 'vue'

type BindingValueFunction = (state: boolean) => void
type BindingValue = BindingValueFunction | [handler: BindingValueFunction, options: UseElementHoverOptions]

function setupElementHover(el: HTMLElement, bindingValue: BindingValue) {
  if (typeof bindingValue === 'function') {
    const isHovered = useElementHover(el)
    watch(isHovered, v => bindingValue(v))
  }
  else {
    const [handler, options] = bindingValue
    const isHovered = useElementHover(el, options)
    watch(isHovered, v => handler(v))
  }
}

export const vElementHover = createDisposableDirective<
  HTMLElement,
  BindingValue
> (
  {
    mounted(el, binding) {
      setupElementHover(el, binding.value)
    },
  },
)

export const vElementHoverVapor: VaporDirective = (el, value) => {
  if (!(el instanceof HTMLElement))
    return

  setupElementHover(el, value?.() as BindingValue)
}
