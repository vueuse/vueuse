import { watch } from 'vue-demi'
import { directiveHooks } from '@vueuse/shared'
import type { ObjectDirective } from 'vue-demi'
import type { UseElementHoverOptions } from '.'
import { useElementHover } from '.'

type BindingValueFunction = (state: boolean) => void

export const vElementHover: ObjectDirective<
  HTMLElement,
  BindingValueFunction | [handler: BindingValueFunction, options: UseElementHoverOptions]
> = {
  [directiveHooks.mounted](el, binding) {
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
