import { directiveHooks } from '@vueuse/shared'
import type { ObjectDirective } from 'vue-demi'
import { useResizeObserver } from '.'
import type { ResizeObserverCallback, UseResizeObserverOptions } from '.'

type BindingValueFunction = ResizeObserverCallback

type BindingValueArray = [BindingValueFunction, UseResizeObserverOptions]

export const vResizeObserver: ObjectDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
> = {
  [directiveHooks.mounted](el, binding) {
    if (typeof binding.value === 'function')
      useResizeObserver(el, binding.value)
    else
      useResizeObserver(el, ...binding.value)
  },
}
