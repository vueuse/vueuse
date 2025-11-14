import type { UseElementBoundingOptions, UseElementBoundingReturn } from '@vueuse/core'
import type { EffectScope, ObjectDirective } from 'vue'
import { useElementBounding } from '@vueuse/core'
import { effectScope, watch } from 'vue'

type ElementBounding = Omit<UseElementBoundingReturn, 'update'>
type BindingValueFunction = (bounding: ElementBounding) => void
type BindingValueArray = [BindingValueFunction, UseElementBoundingOptions]

const vElementBoundingScopes = new WeakMap<HTMLElement, EffectScope>()

export const vElementBounding: ObjectDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    const scope = vElementBoundingScopes.get(el) ?? effectScope()
    vElementBoundingScopes.set(el, scope)
    scope.run(() => {
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
    })
  },
  unmounted(el) {
    vElementBoundingScopes.get(el)?.stop()
    vElementBoundingScopes.delete(el)
  },
}
