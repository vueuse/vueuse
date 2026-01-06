import type { OnKeyStrokeOptions } from '@vueuse/core'
import { onKeyStroke } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'

type BindingValueFunction = (event: KeyboardEvent) => void

type BindingValueArray = [BindingValueFunction, OnKeyStrokeOptions]

export const vOnKeyStroke = createDisposableDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
>(
  {
    mounted(el, binding) {
      const keys = binding.arg?.split(',') ?? true
      if (typeof binding.value === 'function') {
        onKeyStroke(keys, binding.value, {
          target: el,
        })
      }
      else {
        const [handler, options] = binding.value
        onKeyStroke(keys, handler, {
          target: el,
          ...options,
        })
      }
    },
  },
)
