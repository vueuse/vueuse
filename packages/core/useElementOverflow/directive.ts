import type { VaporDirective } from 'vue'
import type { UseElementOverflowOptions, UseElementOverflowReturn } from '.'
import { createDisposableDirective } from '@vueuse/shared'
import { watch } from 'vue'
import { useElementOverflow } from '.'

type VElementOverflowHandler = (info: UseElementOverflowReturn) => void
type BindingValue = VElementOverflowHandler | [VElementOverflowHandler, UseElementOverflowOptions]

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

export const vElementOverflowVapor: VaporDirective = (el, value) => {
  if (!(el instanceof HTMLElement))
    return

  const valueOrHandler = value?.() as BindingValue
  const bindingValue = typeof valueOrHandler === 'function' ? [valueOrHandler] as [VElementOverflowHandler] : valueOrHandler
  const [handler, options] = bindingValue
  const info = useElementOverflow(el, options)
  const { isXOverflowed, isYOverflowed } = info
  watch([isXOverflowed, isYOverflowed], () => handler(info), { immediate: true })
}
