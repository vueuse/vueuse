import type { ObjectDirective } from 'vue'
import type { UseElementVisibilityOptions } from '.'

import { watch } from 'vue'
import { useElementVisibility } from '.'

type BindingValueFunction = (state: boolean) => void

type BindingValueArray = [BindingValueFunction, UseElementVisibilityOptions]

export const vElementVisibility: ObjectDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    if (typeof binding.value === 'function') {
      const handler = binding.value
      const isVisible = useElementVisibility(el)
      watch(isVisible, v => handler(v), { immediate: true })
    }
    else {
      const [handler, options] = binding.value
      const isVisible = useElementVisibility(el, options)
      watch(isVisible, v => handler(v), { immediate: true })
    }
  },
}
