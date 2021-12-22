import { computed, ref, watch } from 'vue-demi'
import type { MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import type { MouseOptions } from '../useMouse'
import { useMouse } from '../useMouse'
import { defaultWindow } from '../_configurable'

export interface MouseInElementOptions extends MouseOptions {
  handleOutside?: boolean
}

/**
 * Reactive mouse position related to an element.
 *
 * @see https://vueuse.org/useMouseInElement
 * @param target
 * @param options
 */
export function useMouseInElement(
  target?: MaybeElementRef,
  options: MouseInElementOptions = {},
) {
  const {
    handleOutside = true,
    window = defaultWindow,
  } = options
  const { x, y, sourceType } = useMouse(options)

  const targetRef = ref(target ?? window?.document.body)
  const elementX = ref(0)
  const elementY = ref(0)
  const elementPositionX = ref(0)
  const elementPositionY = ref(0)
  const elementHeight = ref(0)
  const elementWidth = ref(0)
  const isOutside = ref(false)

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

  let stop = () => {}

  if (window) {
    stop = watch(
      [targetRef, x, y],
      () => {
        const el = unrefElement(targetRef)
        if (!el)
          return

        const {
          left,
          top,
          width,
          height,
        } = el.getBoundingClientRect()

        elementPositionX.value = left + window.pageXOffset
        elementPositionY.value = top + window.pageYOffset
        elementHeight.value = height
        elementWidth.value = width

        const elX = x.value - elementPositionX.value
        const elY = y.value - elementPositionY.value
        isOutside.value = elX < 0 || elY < 0 || elX > elementWidth.value || elY > elementHeight.value

        if (handleOutside || !isOutside.value) {
          elementX.value = elX
          elementY.value = elY
        }
      },
      { immediate: true },
    )
  }

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

export type UseMouseInElementReturn = ReturnType<typeof useMouseInElement>
