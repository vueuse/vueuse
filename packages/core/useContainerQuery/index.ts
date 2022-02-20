import { ref, watch } from 'vue-demi'

import type { Ref } from 'vue-demi'

import { useResizeObserver } from '../useResizeObserver'

export interface Breakpoint {
  /**
   *
   * minimum value of breakpoint (in pixels)
   *
   */
  min: number
  /**
   *
   * maximum value of breakpoint (in pixels) *optional
   *
   */
  max?: number
}

export type QueryBreakpoints = Record<string, Breakpoint>

export interface UseContainerQueryOptions<T> {
  /**
   *
   * Target Element for the container query
   *
   */
  el: Ref<T | null>
  /**
   *
   * Explicit key/value map of the predefined breakpoints
   * you wish to use.
   *
   * N.B. Each value should have a min and max range.
   *
   * (e.g., { sm: { min: 0, max: 300}, md: { min: 301, max: 600 }} )
   *
   */
  breakpoints?: QueryBreakpoints
}

/**
 *
 * useContainerQuery()
 *
 * Element based media query to apply styles based on specified container elements
 *
 * @param options
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries
 * @see https://caniuse.com/css-container-queries
 * @returns the active breakpoint from your specific list of breakpoints e.g,. sm
 */
export const useContainerQuery = <T extends HTMLElement>(options: UseContainerQueryOptions<T>) => {
  // Set the default element and breakpoints:
  const {
    el,
    breakpoints = {
      sm: {
        min: 320,
        max: 480,
      },
      md: {
        min: 481,
        max: 768,
      },
      lg: {
        min: 769,
        max: 1024,
      },
      xl: {
        min: 1025,
        max: 1200,
      },
      xxl: {
        min: 1201,
      },
    },
  } = options

  // This is some initial value
  const initialBreakpoint = Object.keys(breakpoints)[0]

  const activeBreakpoint = ref(initialBreakpoint)

  const width = ref(0)

  useResizeObserver(el, (entries) => {
    const entry = entries[0]
    width.value = Math.round(entry.contentRect.width)
  })

  // Matches the observed "container" current width to a breakpoint:
  const getObservedBreakpoint = () => {
    let observedBreakpoint
    for (const [key, { min, max }] of Object.entries(breakpoints)) {
      if (width.value >= min) {
        if (max === undefined) {
          observedBreakpoint = key
          break
        }
        else if (width.value <= max) {
          observedBreakpoint = key
          break
        }
      }
    }

    return observedBreakpoint || activeBreakpoint.value
  }

  const handleElementResize = () => {
    const observedBreakpoint = getObservedBreakpoint()

    if (observedBreakpoint !== activeBreakpoint.value)
      activeBreakpoint.value = observedBreakpoint
  }

  watch(width, (newWidth: number, prevWidth: number) => {
    if (newWidth === prevWidth) return

    handleElementResize()
  })

  return {
    activeBreakpoint,
    width,
  }
}
