import type { OnKeyStrokeOptions } from '@vueuse/core'
import type { VaporDirective } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'

type BindingValueFunction = (event: KeyboardEvent) => void

type BindingValueArray = [BindingValueFunction, OnKeyStrokeOptions]
type BindingValue = BindingValueFunction | BindingValueArray

function setupOnKeyStroke(el: HTMLElement, bindingValue: BindingValue, argument?: string) {
  const keys = argument?.split(',') ?? true
  if (typeof bindingValue === 'function') {
    onKeyStroke(keys, bindingValue, {
      target: el,
    })
  }
  else {
    const [handler, options] = bindingValue
    onKeyStroke(keys, handler, {
      target: el,
      ...options,
    })
  }
}

export const vOnKeyStroke = createDisposableDirective<
  HTMLElement,
  BindingValue
>(
  {
    mounted(el, binding) {
      setupOnKeyStroke(el, binding.value, binding.arg)
    },
  },
)

export const vOnKeyStrokeVapor: VaporDirective = (el, value, argument) => {
  if (!(el instanceof HTMLElement))
    return

  setupOnKeyStroke(el, value?.() as BindingValue, argument)
}
