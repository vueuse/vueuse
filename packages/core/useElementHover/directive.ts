import type { ObjectDirective } from 'vue'
import type { UseElementHoverOptions } from './index'
import { watch } from 'vue'
import { useElementHover } from './index'

type BindingValueFunction = (state: boolean) => void

export const vElementHover: ObjectDirective<
  HTMLElement,
  BindingValueFunction | [handler: BindingValueFunction, options: UseElementHoverOptions]
> = {
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
}
