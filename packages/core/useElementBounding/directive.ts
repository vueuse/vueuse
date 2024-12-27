import type { ObjectDirective } from 'vue'
import type { UseElementBoundingReturn } from '.'
import { watch } from 'vue'
import { useElementBounding } from '.'

type RemoveFirstFromTuple<T extends any[]> =
  T['length'] extends 0 ? undefined : (((...b: T) => void) extends (a: any, ...b: infer I) => void ? I : [])
type ElementBounding = Omit<UseElementBoundingReturn, 'update'>

type BindingValueFunction = (size: ElementBounding) => void
type VElementBoundingOptions = RemoveFirstFromTuple<Parameters<typeof useElementBounding>>
type BindingValueArray = [BindingValueFunction, ...VElementBoundingOptions]

export const vElementBounding: ObjectDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    const handler = typeof binding.value === 'function' ? binding.value : binding.value?.[0]
    const options = (typeof binding.value === 'function' ? [] : binding.value.slice(1)) as RemoveFirstFromTuple<BindingValueArray>

    const {
      height,
      bottom,
      left,
      right,
      top,
      width,
      x,
      y,
    } = useElementBounding(el, ...options)
    watch([height, bottom, left, right, top, width, x, y], ([height, bottom, left, right, top, width, x, y]) => handler({ height, bottom, left, right, top, width, x, y }))
  },
}
