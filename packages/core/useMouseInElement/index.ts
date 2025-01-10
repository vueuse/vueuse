import type { MaybeElementRef } from '../unrefElement'
import type { UseMouseOptions } from '../useMouse'
import { ref, watch } from 'vue'
import { defaultWindow } from '../_configurable'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import { useMouse } from '../useMouse'

export interface MouseInElementOptions extends UseMouseOptions {
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
  const type = options.type || 'page'

  const { x, y, sourceType } = useMouse(options)

  const targetRef = ref(target ?? window?.document.body)
  const elementX = ref(0)
  const elementY = ref(0)
  const elementPositionX = ref(0)
  const elementPositionY = ref(0)
  const elementHeight = ref(0)
  const elementWidth = ref(0)
  const isOutside = ref(true)

  let stop = () => {}

  if (window) {
    stop = watch(
      [targetRef, x, y],
      () => {
        const el = unrefElement(targetRef)
        if (!el || !(el instanceof Element))
          return

        const {
          left,
          top,
          width,
          height,
        } = el.getBoundingClientRect()

        elementPositionX.value = left + (type === 'page' ? window.pageXOffset : 0)
        elementPositionY.value = top + (type === 'page' ? window.pageYOffset : 0)
        elementHeight.value = height
        elementWidth.value = width

        const elX = x.value - elementPositionX.value
        const elY = y.value - elementPositionY.value
        isOutside.value = width === 0 || height === 0
        || elX < 0 || elY < 0
        || elX > width || elY > height

        if (handleOutside || !isOutside.value) {
          elementX.value = elX
          elementY.value = elY
        }
      },
      { immediate: true },
    )

    useEventListener(
      document,
      'mouseleave',
      () => isOutside.value = true,
      { passive: true },
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
    isOutside,
    stop,
  }
}

export type UseMouseInElementReturn = ReturnType<typeof useMouseInElement>
