import { ref, watch } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { pausableWatch, resolveUnref } from '@vueuse/shared'
import { useEventListener, useMouse, useScroll } from '@vueuse/core'

export interface UseDragToScrollOptions {

  /**
   * Enable scroll inertia. This will cause the scroll to continue for some time after the mouse is released.
   *
   * @default true
   */
  inertia?: MaybeComputedRef<boolean>

  /**
   * Disable scroll on X axis
   *
   * @default false
   */
  disableX?: MaybeComputedRef<boolean>

  /**
   * Disable scroll on Y axis
   *
   * @default false
   */
  disableY?: MaybeComputedRef<boolean>

  /**
   * Friction of the scroll inertia. The higher the value, the faster the scroll will stop.
   * Only applicable when `inertia` is enabled.
   *
   * @default 0.03
   */
  friction?: MaybeComputedRef<number>

}

/**
 * Reactive drag to scroll.
 *
 * @see https://vueuse.org/useDragToScroll
 * @param target
 * @param options
 */
export function useDragToScroll(target: MaybeComputedRef<HTMLElement | SVGElement | Window | Document | null | undefined>, options: UseDragToScrollOptions = {}) {
  const {
    inertia = true,
    disableX = false,
    disableY = false,
    friction = 0.03,
  } = options

  const pressed = ref(false)
  const { x, y } = useMouse({ touch: false })
  const { x: scrollX, y: scrollY, isScrolling } = useScroll(target)

  let lastX = 0
  let lastY = 0
  let lastScrollX = 0
  let lastScrollY = 0
  let time = 0
  let animation = 0

  useEventListener(target, 'mousedown', () => pressed.value = true)
  useEventListener('mouseup', () => pressed.value = false)

  const { isActive, pause, resume } = pausableWatch(pressed, () => {
    if (!pressed.value && time) {
      // Mouse Up
      const diff = new Date().getTime() - time

      const speedY = (scrollY.value - lastScrollY) / diff / resolveUnref(friction)
      const speedX = (scrollX.value - lastScrollX) / diff / resolveUnref(friction)

      let absSpeedY = Math.abs(speedY)
      let absSpeedX = Math.abs(speedX)

      const animate = () => {
        if (absSpeedY > 0) {
          if (speedY > 0)
            scrollY.value += absSpeedY--
          else
            scrollY.value -= absSpeedY--
        }

        if (absSpeedX > 0) {
          if (speedX > 0)
            scrollX.value += absSpeedX--
          else
            scrollX.value -= absSpeedX--
        }

        if (absSpeedY === 0 && absSpeedX > 0 && animation)
          cancelAnimationFrame(animation)
        else
          animation = requestAnimationFrame(animate)
      }

      if (resolveUnref(inertia))
        animate()
    }
    else {
      // Mouse Down
      cancelAnimationFrame(animation)

      time = new Date().getTime()

      lastX = x.value
      lastY = y.value
      lastScrollX = scrollX.value
      lastScrollY = scrollY.value
    }
  })

  watch([x, y], () => {
    if (!pressed.value || !isActive.value)
      return

    if (!resolveUnref(disableX))
      scrollX.value -= x.value - lastX

    if (!resolveUnref(disableY))
      scrollY.value -= y.value - lastY

    lastX = x.value
    lastY = y.value
  })

  return {
    isActive,
    pause,
    resume,
    isScrolling,
  }
}
