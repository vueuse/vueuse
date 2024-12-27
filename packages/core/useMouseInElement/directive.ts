import type { ObjectDirective } from 'vue'
import type { MouseInElementOptions, UseMouseInElementReturn } from '.'
import { watch } from 'vue'
import { useMouseInElement } from '.'

type MouseInElement = Omit<UseMouseInElementReturn, 'stop'>
type BindingValueFunction = (mouse: MouseInElement) => void
type BindingValueArray = [BindingValueFunction, MouseInElementOptions]

export const vMouseInElement: ObjectDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    const [handler, options] = (typeof binding.value === 'function' ? [binding.value, {}] : binding.value) as BindingValueArray

    const {
      x,
      y,
      sourceType,
      elementX,
      elementY,
      elementPositionX,
      elementPositionY,
      elementHeight,
      elementWidth,
      isOutside,
    } = useMouseInElement(el, options)
    watch([x, y, sourceType, elementX, elementY, elementPositionX, elementPositionY, elementHeight, elementWidth, isOutside], () => handler({ x, y, sourceType, elementX, elementY, elementPositionX, elementPositionY, elementHeight, elementWidth, isOutside }))
  },
}
