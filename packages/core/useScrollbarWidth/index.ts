import type { ShallowRef } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import type { MaybeComputedElementRef } from '../unrefElement'
import { shallowRef } from 'vue'
import { defaultWindow } from '../_configurable'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import { useResizeObserver } from '../useResizeObserver'

export interface UseScrollbarWidthOptions extends ConfigurableWindow {}

/**
 * Reactively report the scrollbar width of an HTML element.
 *
 * Calculated as `offsetWidth - clientWidth`. Recomputes whenever the element
 * is resized or the window is resized (catches zoom level changes).
 *
 * Returns `0` for browsers with overlay scrollbars (Safari, mobile) or until
 * the target is mounted.
 *
 * @see https://vueuse.org/useScrollbarWidth
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useScrollbarWidth(
  target: MaybeComputedElementRef,
  options: UseScrollbarWidthOptions = {},
): ShallowRef<number> {
  const { window = defaultWindow } = options
  const scrollbarWidth = shallowRef(0)

  function calc() {
    const el = unrefElement(target)
    scrollbarWidth.value = el ? el.offsetWidth - el.clientWidth : 0
  }

  useResizeObserver(target, calc)

  if (window)
    useEventListener(window, 'resize', calc, { passive: true })

  return scrollbarWidth
}

export type UseScrollbarWidthReturn = ReturnType<typeof useScrollbarWidth>
