import { MaybeRef } from '@vueuse/shared'
import { ref, watch } from 'vue-demi'
import { MouseOptions, useMouse } from '../useMouse'
import { defaultWindow } from '../_configurable'

export interface MouseInElementOptions extends MouseOptions {
  handleOutside?: boolean
}

/**
 * Reactive mouse position related to an element.
 *
 * @see   {@link https://vueuse.js.org/useMouseInElement}
 * @param target
 * @param options
 */
export function useMouseInElement(
  target?: MaybeRef<Element | null | undefined>,
  options: MouseInElementOptions = {},
) {
  const {
    handleOutside = true,
    window = defaultWindow,
  } = options
  const { x, y, sourceType } = useMouse(options)

  const targetRef = ref(target || window?.document.body)
  const elementX = ref(0)
  const elementY = ref(0)
  const elementPositionX = ref(0)
  const elementPositionY = ref(0)
  const elementHeight = ref(0)
  const elementWidth = ref(0)
  const isOutside = ref(false)

  let stop = () => {}

  if (window) {
    stop = watch(
      [targetRef, x, y],
      () => {
        const el = targetRef.value
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
    isOutside,
    stop,
  }
}
