import type { UseElementBoundingOptions, UseElementBoundingReturn } from '@vueuse/core'
import type { VaporDirective } from 'vue'
import { useElementBounding } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'
import { watch } from 'vue'

type ElementBounding = Omit<UseElementBoundingReturn, 'update'>
type BindingValueFunction = (bounding: ElementBounding) => void
type BindingValueArray = [BindingValueFunction, UseElementBoundingOptions]
type BindingValue = BindingValueFunction | BindingValueArray

function setupElementBounding(el: HTMLElement, bindingValue: BindingValue) {
  const [handler, options] = (typeof bindingValue === 'function' ? [bindingValue, {}] : bindingValue) as BindingValueArray
  const {
    height,
    bottom,
    left,
    right,
    top,
    width,
    x,
    y,
  } = useElementBounding(el, options)
  watch([height, bottom, left, right, top, width, x, y], () => handler({ height, bottom, left, right, top, width, x, y }))
}

export const vElementBounding = createDisposableDirective<
  HTMLElement,
  BindingValue
> (
  {
    mounted(el, binding) {
      setupElementBounding(el, binding.value)
    },
  },
)

export const vElementBoundingVapor: VaporDirective = (el, value) => {
  if (!(el instanceof HTMLElement))
    return

  setupElementBounding(el, value?.() as BindingValue)
}
