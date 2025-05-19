import type { ObjectDirective } from 'vue'
import type { UseElementOverflowOptions, UseElementOverflowReturn } from '.'
import { watch } from 'vue'
import { useElementOverflow } from '.'

type VElementOverflowHandler = (info: UseElementOverflowReturn) => void

export const vElementOverflow: ObjectDirective<
  HTMLElement,
  VElementOverflowHandler | [VElementOverflowHandler, UseElementOverflowOptions]
> = {
  mounted(el, binding) {
    const bindingValue = typeof binding.value === 'function' ? [binding.value] as [VElementOverflowHandler] : binding.value
    const [handler, options] = bindingValue
    const info = useElementOverflow(el, options)
    const { isXOverflowed, isYOverflowed } = info
    watch([isXOverflowed, isYOverflowed], () => handler(info), { immediate: true })
  },
}
