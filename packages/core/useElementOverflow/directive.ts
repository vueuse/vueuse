import type { UseElementOverflowOptions, UseElementOverflowReturn } from '.'
import { createDisposableDirective } from '@vueuse/shared'
import { watch } from 'vue'
import { useElementOverflow } from '.'

type VElementOverflowHandler = (info: UseElementOverflowReturn) => void

export const vElementOverflow = createDisposableDirective<
  HTMLElement,
  VElementOverflowHandler | [VElementOverflowHandler, UseElementOverflowOptions]
>({
  mounted(el, binding) {
    const bindingValue = typeof binding.value === 'function' ? [binding.value] as [VElementOverflowHandler] : binding.value
    const [handler, options] = bindingValue
    const info = useElementOverflow(el, options)
    const { isXOverflowed, isYOverflowed } = info
    watch([isXOverflowed, isYOverflowed], () => handler(info), { immediate: true })
  },
})
