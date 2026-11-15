import type { UseElementHoverOptions } from '@vueuse/core'
import { useElementHover } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'
import { watch } from 'vue'

type BindingValueFunction = (state: boolean) => void

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
