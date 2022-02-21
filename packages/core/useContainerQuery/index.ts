import { computed, ref, unref } from 'vue-demi'
import type { MaybeElementRef, MaybeRef } from '@vueuse/core'
import { useResizeObserver } from '../useResizeObserver'

export interface Breakpoint {
  /**
   *
   * minimum value of breakpoint (in pixels)
   *
   */
  min?: number
  /**
   *
   * maximum value of breakpoint (in pixels) *optional
   *
   */
  max?: number
}

export type QueryBreakpoints = Record<string, Breakpoint>

export interface UseContainerQueryOptions {
  /**
   *
   * Target Element for the container query
   *
   */
  element: MaybeElementRef
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
  breakpoints?: MaybeRef<QueryBreakpoints>
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
export function useContainerQuery(options: UseContainerQueryOptions) {
  // Set the default element and breakpoints:
  const {
    element,
    breakpoints = {
      sm: {
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

  const width = ref(0)

  useResizeObserver(element, ([entry]) => width.value = Math.round(entry.contentRect.width))

  const activeBreakpoint = computed(() => {
    for (const [key, { min = 0, max }] of Object.entries(unref(breakpoints)))
      if (width.value >= min && (max === undefined || width.value <= max)) return key
  })

  return {
    activeBreakpoint,
    width,
  }
}
