import { watch } from 'vue-demi'
import { directiveHooks } from '@vueuse/shared'
import type { ObjectDirective } from 'vue-demi'
import { useElementHover } from '.'

type BindingValueFunction = (state: boolean) => void

export const vElementHover: ObjectDirective<
HTMLElement,
BindingValueFunction
> = {
  [directiveHooks.mounted](el, binding) {
    if (typeof binding.value === 'function') {
      const isHovered = useElementHover(el)
      watch(isHovered, v => binding.value(v))
    }
  },
}
