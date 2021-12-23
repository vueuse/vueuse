import { computed, ref } from 'vue-demi'
import type { MaybeElementRef } from '../unrefElement'
import type { MouseInElementOptions } from '../useMouseInElement'
import { useMouseInElement } from '../useMouseInElement'
import { defaultWindow } from '../_configurable'

/**
 * Reactive mouse position related to the mouse position's distance to an element
 *
 * @see https://vueuse.org/useMouseDistanceToElement
 * @param target
 * @param options
 */
export function useMouseDistanceToElement(
  target?: MaybeElementRef,
  options: MouseInElementOptions = {},
) {
  const {
    window = defaultWindow,
  } = options

  const targetRef = ref(target ?? window?.document.body)

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
  } = useMouseInElement(targetRef, options)

  // The scalar distance (in pixels) from the center of the element
  // and current mouse { x, y } position:
  const elementDistanceToCenter = computed(() => {
    return Math.floor(
      Math.sqrt(
        Math.pow(x.value - (elementPositionX.value + elementWidth.value / 2), 2)
        + Math.pow(y.value - (elementPositionY.value + elementHeight.value / 2), 2),
      ),
    )
  })

  // The scalar distance (in pixels) from the boundary of the element
  // and current mouse { x, y } position:
  const elementDistanceToBoundary = computed(() => {
    const X = Math.max(Math.min(x.value, elementPositionX.value + elementWidth.value), elementPositionX.value)

    const Y = Math.max(Math.min(y.value, elementPositionY.value + elementHeight.value), elementPositionY.value)

    return Math.floor(
      Math.sqrt(
        Math.pow(x.value - X, 2)
        + Math.pow(y.value - Y, 2),
      ),
    )
  })

  return {
    x,
    y,
    sourceType,
    elementX,
    elementY,
    elementPositionX,
    elementPositionY,
    elementHeight,
    elementWidth,
    elementDistanceToCenter,
    elementDistanceToBoundary,
    isOutside,
    stop,
  }
}

export type UseMouseDistanceToElementReturn = ReturnType<typeof useMouseDistanceToElement>
