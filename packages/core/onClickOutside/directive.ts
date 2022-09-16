import { directiveHooks } from '@vueuse/shared'
import type { ObjectDirective } from 'vue-demi'
import { onClickOutside } from '.'
import type { OnClickOutsideHandler, OnClickOutsideOptions } from '.'

export const vOnClickOutside: ObjectDirective<
HTMLElement,
OnClickOutsideHandler | [(evt: any) => void, OnClickOutsideOptions]
> = {
  [directiveHooks.mounted](el, binding) {
    const capture = !binding.modifiers.bubble
    if (typeof binding.value === 'function') {
      (el as any).__onClickOutside_stop = onClickOutside(el, binding.value, { capture })
    }
    else {
      const [handler, options] = binding.value
      ;(el as any).__onClickOutside_stop = onClickOutside(el, handler, Object.assign({ capture }, options))
    }
  },
  [directiveHooks.unmounted](el) {
    (el as any).__onClickOutside_stop()
  },
}

// alias
export { vOnClickOutside as VOnClickOutside }
