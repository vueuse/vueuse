import type { VaporDirective } from 'vue'
import type { UseElementOverflowOptions, UseElementOverflowReturn } from '.'
import { createDisposableDirective } from '@vueuse/shared'
import { watch } from 'vue'
import { useElementOverflow } from '.'

type VElementOverflowHandler = (info: UseElementOverflowReturn) => void
type BindingValue = VElementOverflowHandler | [VElementOverflowHandler, UseElementOverflowOptions]

function setupElementOverflow(el: HTMLElement, valueOrHandler: BindingValue) {
  const bindingValue = typeof valueOrHandler === 'function' ? [valueOrHandler] as [VElementOverflowHandler] : valueOrHandler
  const [handler, options] = bindingValue
  const info = useElementOverflow(el, options)
  const { isXOverflowed, isYOverflowed } = info
  watch([isXOverflowed, isYOverflowed], () => handler(info), { immediate: true })
}

export const vElementOverflow = createDisposableDirective<
  HTMLElement,
  BindingValue
>({
  mounted(el, binding) {
    setupElementOverflow(el, binding.value)
  },
})

export const vElementOverflowVapor: VaporDirective = (el, value) => {
  if (!(el instanceof HTMLElement))
    return

  setupElementOverflow(el, value?.() as BindingValue)
}
