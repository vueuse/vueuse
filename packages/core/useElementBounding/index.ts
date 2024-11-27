import type { MaybeComputedElementRef } from '../unrefElement'
import { tryOnMounted } from '@vueuse/shared'
import { ref, watch } from 'vue'
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
   * Timing to recalculate the bounding box
   *
   * Setting to `next-frame` can be useful when using this together with something like {@link useBreakpoints}
   * and therefore the layout (which influences the bounding box of the observed element) is not updated on the current tick.
   *
   * @default 'sync'
   */
  updateTiming?: 'sync' | 'next-frame'

  /**
   * Calculate bounding box values relative to the nearest bounding parent.
   *
   * If enabled, the computed values (e.g., `left`, `top`, etc.) are adjusted to be relative
   * to the nearest bounding parent element (e.g., an element with `transform`, `perspective`,
   * or `filter` applied) instead of the viewport.
   *
   * @default false
   */
  relativeToContainer?: boolean
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
) {
  const {
    reset = true,
    windowResize = true,
    windowScroll = true,
    immediate = true,
    updateTiming = 'sync',
    relativeToContainer = false,
  } = options

  const height = ref(0)
  const bottom = ref(0)
  const left = ref(0)
  const right = ref(0)
  const top = ref(0)
  const width = ref(0)
  const x = ref(0)
  const y = ref(0)

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

    if (relativeToContainer) {
      const boundingParent = getBoundingParent(el)
      const parentRect = boundingParent.getBoundingClientRect()

      if (parentRect) {
        top.value -= parentRect.top
        left.value -= parentRect.left
        bottom.value -= parentRect.top
        right.value -= parentRect.left
      }
    }
  }

  function update() {
    if (updateTiming === 'sync')
      recalculate()
    else if (updateTiming === 'next-frame')
      requestAnimationFrame(() => recalculate())
  }

  function getBoundingParent(el: HTMLElement | SVGElement | null | undefined) {
    let parent = el?.parentElement

    while (parent) {
      const style = window.getComputedStyle(parent)

      // Check for properties that create a containing block
      if (
        style.transform !== 'none' // Transform applies containment
        || style.perspective !== 'none' // Perspective creates containment
        || style.filter !== 'none' // Filter creates a new stacking context
        || style.willChange.includes('transform') // Will-change can create containment
        || style.position === 'fixed' // Fixed can create containment in rare cases
      ) {
        return parent
      }

      parent = parent.parentElement
    }

    return document.body
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

export type UseElementBoundingReturn = ReturnType<typeof useElementBounding>
