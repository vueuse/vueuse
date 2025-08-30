import type { UseElementVisibilityOptions } from '@vueuse/core'
import type { ObjectDirective } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import { watch } from 'vue'

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
