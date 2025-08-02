import type { UseElementBoundingOptions, UseElementBoundingReturn } from '@vueuse/core'
import type { ObjectDirective } from 'vue'
import { useElementBounding } from '@vueuse/core'
import { watch } from 'vue'

type ElementBounding = Omit<UseElementBoundingReturn, 'update'>
type BindingValueFunction = (bounding: ElementBounding) => void
type BindingValueArray = [BindingValueFunction, UseElementBoundingOptions]

export const vElementBounding: ObjectDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    const [handler, options] = (typeof binding.value === 'function' ? [binding.value, {}] : binding.value) as BindingValueArray

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
  },
}
