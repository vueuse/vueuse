import type { Directive } from 'vue-demi'
import { directiveHooks } from '@vueuse/shared'

import { useVisible } from '.'

export const vVisible: Directive<HTMLElement, boolean> = {
  [directiveHooks.mounted](el, binding) {
    useVisible(el, binding.value)
  },
  [directiveHooks.updated](el, binding) {
    useVisible(el, binding.value)
  },
}

