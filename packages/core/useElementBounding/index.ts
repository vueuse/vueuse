import type { Ref } from 'vue'
import type { MaybeComputedElementRef } from '../unrefElement'
import { tryOnMounted } from '@vueuse/shared'
import { isRef, ref, watch } from 'vue'
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

  const container = createDomRect()
  const { el, ...containerDomRect } = container

  const { height, bottom, left, right, top, width, x, y } = createDomRect()

  function recalculate() {
    const el = unrefElement(target)

    if (!el) {
      if (reset) {
        resetDomRect({ height, bottom, left, right, top, width, x, y })
        resetDomRect(containerDomRect)
      }
      return
    }

    const rect = el.getBoundingClientRect()

    setDomRect({ height, bottom, left, right, top, width, x, y }, rect)

    if (relativeToContainer) {
      container.el = getBoundingParent(el)
      const parentRect = container.el.getBoundingClientRect()

      if (parentRect) {
        top.value -= Math.max(0, parentRect.top)
        left.value -= Math.max(0, parentRect.left)
        bottom.value -= Math.max(0, parentRect.top)
        right.value -= Math.max(0, parentRect.left)

        setDomRect(containerDomRect, parentRect)
      }
    }
  }

  function update() {
    if (updateTiming === 'sync')
      recalculate()
    else if (updateTiming === 'next-frame')
      requestAnimationFrame(() => recalculate())
  }

  function resetDomRect(target: Record<string, Ref<number>>) {
    Object.keys(target).forEach((key) => {
      if (isRef(target[key]))
        target[key].value = 0
    })
  }

  function setDomRect(target: Record<string, Ref<number>>, domRect: DOMRect) {
    Object.keys(target).forEach((key) => {
      if (isRef(target[key]))
        target[key].value = domRect[key as keyof DOMRect] as number
    })
  }

  function createDomRect() {
    const refValue = () => ref(0)
    return {
      el: null as HTMLElement | SVGElement | null | undefined,
      height: refValue(),
      bottom: refValue(),
      left: refValue(),
      right: refValue(),
      top: refValue(),
      width: refValue(),
      x: refValue(),
      y: refValue(),
    }
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
    container,
  }
}

export type UseElementBoundingReturn = ReturnType<typeof useElementBounding>
