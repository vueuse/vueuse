import type { MaybeElementRef } from '../unrefElement'
import type { UseMouseOptions } from '../useMouse'
import { tryOnMounted } from '@vueuse/shared'
import { shallowRef, watch } from 'vue'
import { defaultWindow } from '../_configurable'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import { useMouse } from '../useMouse'
import { useMutationObserver } from '../useMutationObserver'
import { useResizeObserver } from '../useResizeObserver'

export interface MouseInElementOptions extends UseMouseOptions {
  /**
   * Whether to handle mouse events when the cursor is outside the target element.
   * When enabled, mouse position will continue to be tracked even when outside the element bounds.
   *
   * @default true
   */
  handleOutside?: boolean

  /**
   * Listen to window resize event
   *
   * @default true
   */
  windowScroll?: boolean

  /**
   * Listen to window scroll event
   *
   * @default true
   */
  windowResize?: boolean
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
    windowResize = true,
    windowScroll = true,
    handleOutside = true,
    window = defaultWindow,
  } = options
  const type = options.type || 'page'

  const { x, y, sourceType } = useMouse(options)

  const targetRef = shallowRef(target ?? window?.document.body)
  const elementX = shallowRef(0)
  const elementY = shallowRef(0)
  const elementPositionX = shallowRef(0)
  const elementPositionY = shallowRef(0)
  const elementHeight = shallowRef(0)
  const elementWidth = shallowRef(0)
  const isOutside = shallowRef(true)

  function update() {
    if (!window)
      return

    const el = unrefElement(targetRef)
    if (!el || !(el instanceof Element))
      return

    for (const rect of el.getClientRects()) {
      const {
        left,
        top,
        width,
        height,
      } = rect

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

      if (!isOutside.value)
        break
    }
  }

  const stopFnList: Array<() => void> = []
  function stop() {
    stopFnList.forEach(fn => fn())
    stopFnList.length = 0
  }

  tryOnMounted(() => {
    update()
  })

  if (window) {
    const {
      stop: stopResizeObserver,
    } = useResizeObserver(targetRef, update)
    const {
      stop: stopMutationObserver,
    } = useMutationObserver(targetRef, update, {
      attributeFilter: ['style', 'class'],
    })

    const stopWatch = watch(
      [targetRef, x, y],
      update,
    )

    stopFnList.push(
      stopResizeObserver,
      stopMutationObserver,
      stopWatch,
    )

    useEventListener(
      document,
      'mouseleave',
      () => isOutside.value = true,
      { passive: true },
    )

    if (windowScroll) {
      stopFnList.push(
        useEventListener('scroll', update, { capture: true, passive: true }),
      )
    }
    if (windowResize) {
      stopFnList.push(
        useEventListener('resize', update, { passive: true }),
      )
    }
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
