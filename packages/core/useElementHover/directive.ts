import { watch } from 'vue-demi'
import { directiveHooks } from '@vueuse/shared'
import type { ObjectDirective } from 'vue-demi'
import type { UseElementHoverOptions } from '.'
import { useElementHover } from '.'

type BindingValueFunction = (state: boolean) => void

type BindingValueArray = [
  BindingValueFunction,
  UseElementHoverOptions,
]

export const vElementHover: ObjectDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
> = {
  [directiveHooks.mounted](el, binding) {
    if (typeof binding.value === 'function') {
      const isHovered = useElementHover(el)
      const handler = binding.value
      watch(isHovered, v => handler(v))
    }
    else {
      const [handler, options] = binding.value
      const isHovered = useElementHover(el, options)
      watch(isHovered, v => handler(v))
    }
  },
}
