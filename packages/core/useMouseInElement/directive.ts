import type { ObjectDirective } from 'vue-demi'
import { watch } from 'vue-demi'
import { directiveHooks } from '@vueuse/shared'
import type { UseMouseSourceType } from '@vueuse/core'
import type { MouseInElementOptions } from '.'
import { useMouseInElement } from '.'

type RemoveFirstFromTuple<T extends any[]> =
    T['length'] extends 0 ? undefined :
        (((...b: T) => void) extends (a: any, ...b: infer I) => void ? I : [])

interface MouseInElement {
  x: number
  y: number
  sourceType: UseMouseSourceType
  elementX: number
  elementY: number
  elementWidth: number
  elementHeight: number
  elementPositionX: number
  elementPositionY: number
  isOutside: boolean
}

type BindingValueFunction = (mouse: MouseInElement) => void
type BindingValueArray = [BindingValueFunction, MouseInElementOptions]

export const vMouseInElement: ObjectDirective<
  HTMLElement,
    BindingValueFunction | BindingValueArray
> = {
  [directiveHooks.mounted](el, binding) {
    const handler = typeof binding.value === 'function' ? binding.value : binding.value?.[0]
    const options = (typeof binding.value === 'function' ? [] : binding.value.slice(1)) as RemoveFirstFromTuple<BindingValueArray>
    const {
      x,
      y,
      sourceType,
      elementX,
      elementY,
      elementWidth,
      elementHeight,
      elementPositionX,
      elementPositionY,
      isOutside,
    } = useMouseInElement(el, ...options)
    watch([
      x,
      y,
      sourceType,
      elementX,
      elementY,
      elementWidth,
      elementHeight,
      elementPositionX,
      elementPositionY,
      isOutside,
    ], ([
      x,
      y,
      sourceType,
      elementX,
      elementY,
      elementWidth,
      elementHeight,
      elementPositionX,
      elementPositionY,
      isOutside,
    ]) => handler({
      x,
      y,
      sourceType,
      elementX,
      elementY,
      elementWidth,
      elementHeight,
      elementPositionX,
      elementPositionY,
      isOutside,
    }))
  },
}
