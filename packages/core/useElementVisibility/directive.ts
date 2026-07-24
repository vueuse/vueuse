import type { UseElementVisibilityOptions, UseElementVisibilityReturn } from '@vueuse/core'
import type { VaporDirective } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'
import { watch } from 'vue'

/**
 * For backward compatibility, the directive supports two types of binding callbacks:
 * 1. A function that receives a boolean indicating visibility (without controls) (default).
 * 2. A function that receives the full state (with controls).
 */
type BindingValueFunctionWithoutControls = (isVisible: boolean) => void
type BindingValueFunctionWithControls = (state: UseElementVisibilityReturn<true>) => void

type BindingValueArray = [BindingValueFunctionWithoutControls, UseElementVisibilityOptions<false>]
  | [BindingValueFunctionWithControls, UseElementVisibilityOptions<true>]
type BindingValue = BindingValueFunctionWithoutControls | BindingValueArray

function setupElementVisibility(el: HTMLElement, bindingValue: BindingValue) {
  if (typeof bindingValue === 'function') {
    const isVisible = useElementVisibility(el)
    watch(isVisible, v => bindingValue(v), { immediate: true })
  }
  else {
    const [handler, options] = bindingValue
    if (options?.controls) {
      const state = useElementVisibility(el, options)
      watch(state.isVisible, () => (handler as BindingValueFunctionWithControls)(state), { immediate: true })
    }
    else {
      const isVisible = useElementVisibility(el, options as UseElementVisibilityOptions<false>)
      watch(isVisible, v => (handler as BindingValueFunctionWithoutControls)(v), { immediate: true })
    }
  }
}

export const vElementVisibility = createDisposableDirective<
  HTMLElement,
  BindingValue
>(
  {
    mounted(el, binding) {
      setupElementVisibility(el, binding.value)
    },
  },
)

export const vElementVisibilityVapor: VaporDirective = (el, value) => {
  if (!(el instanceof HTMLElement))
    return

  setupElementVisibility(el, value?.() as BindingValue)
}
