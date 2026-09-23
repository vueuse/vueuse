import type { ShallowRef } from 'vue'
import type { MaybeComputedElementRef } from '../unrefElement'
import { tryOnMounted } from '@vueuse/shared'
import { shallowRef, watch } from 'vue'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import { useMutationObserver } from '../useMutationObserver'
import { useResizeObserver } from '../useResizeObserver'

export interface UseElementBoundingOptions {
  /**
   * Reset values to 0 on component unmounted
   *
   * @default true
   */
  reset?: boolean

  /**
   * Listen to window resize event
   *
   * @default true
   */
  windowResize?: boolean
  /**
   * Listen to window scroll event
   *
   * @default true
   */
  windowScroll?: boolean

  /**
   * Immediately call update on component mounted
   *
   * @default true
   */
  immediate?: boolean

  /**
   * Delay (in milliseconds) before calling the `update()` function after the component is mounted.
   *
   * This ensures the initial bounding box is computed correctly, especially when the target element
   * has a transition effect. Without a delay, `update()` might be called prematurely, leading to
   * inaccurate calculations if the element's layout is still in flux.
   *
   * Use this option to allow animations or transitions to complete before the bounding box is measured.
   *
   * @default 0
   */
  immediateWithDelay?: number

  /**
   * Timing to recalculate the bounding box
   *
   * Setting to `next-frame` can be useful when using this together with something like {@link useBreakpoints}
   * and therefore the layout (which influences the bounding box of the observed element) is not updated on the current tick.
   *
   * @default 'sync'
   */
  updateTiming?: 'sync' | 'next-frame'
}

export interface UseElementBoundingReturn {
  height: ShallowRef<number>
  bottom: ShallowRef<number>
  left: ShallowRef<number>
  right: ShallowRef<number>
  top: ShallowRef<number>
  width: ShallowRef<number>
  x: ShallowRef<number>
  y: ShallowRef<number>
  update: () => void
}

/**
 * Reactive bounding box of an HTML element.
 *
 * @see https://vueuse.org/useElementBounding
 * @param target
 */
export function useElementBounding(
  target: MaybeComputedElementRef,
  options: UseElementBoundingOptions = {},
): UseElementBoundingReturn {
  const {
    reset = true,
    windowResize = true,
    windowScroll = true,
    immediate = true,
    immediateWithDelay = 0,
    updateTiming = 'sync',
  } = options

  const height = shallowRef(0)
  const bottom = shallowRef(0)
  const left = shallowRef(0)
  const right = shallowRef(0)
  const top = shallowRef(0)
  const width = shallowRef(0)
  const x = shallowRef(0)
  const y = shallowRef(0)

  function recalculate() {
    const el = unrefElement(target)

    if (!el) {
      if (reset) {
        height.value = 0
        bottom.value = 0
        left.value = 0
        right.value = 0
        top.value = 0
        width.value = 0
        x.value = 0
        y.value = 0
      }
      return
    }

    const rect = el.getBoundingClientRect()

    height.value = rect.height
    bottom.value = rect.bottom
    left.value = rect.left
    right.value = rect.right
    top.value = rect.top
    width.value = rect.width
    x.value = rect.x
    y.value = rect.y
  }

  function update() {
    if (updateTiming === 'sync')
      recalculate()
    else if (updateTiming === 'next-frame')
      requestAnimationFrame(() => recalculate())
  }

  useResizeObserver(target, update)
  watch(() => unrefElement(target), ele => !ele && update())
  // trigger by css or style
  useMutationObserver(target, update, {
    attributeFilter: ['style', 'class'],
  })

  if (windowScroll)
    useEventListener('scroll', update, { capture: true, passive: true })
  if (windowResize)
    useEventListener('resize', update, { passive: true })

  tryOnMounted(() => {
    if (immediate)
      update()
    if (immediateWithDelay)
      setTimeout(update, immediateWithDelay)
  })

  return {
    height,
    bottom,
    left,
    right,
    top,
    width,
    x,
    y,
    update,
  }
}
