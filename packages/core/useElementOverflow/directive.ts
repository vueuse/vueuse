import { watch } from 'vue-demi'
import { directiveHooks } from '@vueuse/shared'
import type { ObjectDirective } from 'vue-demi'
import { type UseElementOverflowOptions, type UseElementOverflowReturn, useElementOverflow } from '.'

type VElementOverflowHandler = (info: UseElementOverflowReturn) => void

export const vElementOverflow: ObjectDirective<
  HTMLElement,
  VElementOverflowHandler | [VElementOverflowHandler, UseElementOverflowOptions]
> = {
  [directiveHooks.mounted](el, binding) {
    const bindingValue = typeof binding.value === 'function' ? [binding.value] as [VElementOverflowHandler] : binding.value
    const [handler, options] = bindingValue
    const info = useElementOverflow(el, options)
    const { isXOverflowed, isYOverflowed } = info
    watch([isXOverflowed, isYOverflowed], () => handler(info), { immediate: true })
  },
}
