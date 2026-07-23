import type { UseElementHoverOptions } from '@vueuse/core'
import type { VaporDirective } from 'vue'
import { useElementHover } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'
import { watch } from 'vue'

type BindingValueFunction = (state: boolean) => void
type BindingValue = BindingValueFunction | [handler: BindingValueFunction, options: UseElementHoverOptions]

export const vElementHover = createDisposableDirective<
  HTMLElement,
  BindingValueFunction | [handler: BindingValueFunction, options: UseElementHoverOptions]
> (
  {
    mounted(el, binding) {
      const value = binding.value
      if (typeof value === 'function') {
        const isHovered = useElementHover(el)
        watch(isHovered, v => value(v))
      }
      else {
        const [handler, options] = value
        const isHovered = useElementHover(el, options)
        watch(isHovered, v => handler(v))
      }
    },
  },
)

export const vElementHoverVapor: VaporDirective = (el, value) => {
  if (!(el instanceof HTMLElement))
    return

  const bindingValue = value?.() as BindingValue
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
