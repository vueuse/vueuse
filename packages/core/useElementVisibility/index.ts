import type { MaybeComputedRef } from '@vueuse/shared'
import { hasOwn } from '@vueuse/shared'
import { computed, reactive } from 'vue-demi'
import type { MaybeComputedElementRef } from '../unrefElement'
import { useElementBounding } from '../useElementBounding'
import { useEventListener } from '../useEventListener'
import { useWindowSize } from '../useWindowSize'
import type { ConfigurableWindow } from '../_configurable'

export interface UseElementVisibilityOptions extends ConfigurableWindow {
  scrollTarget?: MaybeComputedRef<HTMLElement | undefined | null>
}

/**
 * Tracks the visibility of an element within the viewport.
 *
 * @see https://vueuse.org/useElementVisibility
 * @param element
 * @param options
 */
export function useElementVisibility(
  element: MaybeComputedElementRef,
  options: UseElementVisibilityOptions = {},
) {
  const { scrollTarget } = options

  const elementBounding = reactive(useElementBounding(element))
  const targetBounding = reactive(useElementBounding(scrollTarget))
  const viewportSize = reactive(
    useWindowSize({
      // pass down the `configurableWindow`
      ...options,
      includeScrollbar: false,
    }),
  )

  const elementIsVisible = computed<boolean>(() => {
    // window or element is nullish
    if ((hasOwn(options, 'window') && !options.window) || !element)
      return false

    if (scrollTarget) {
      return (
        // relative to the `scrollTarget`
        elementBounding.top <= targetBounding.bottom
        && elementBounding.left <= targetBounding.right
        && elementBounding.bottom >= targetBounding.top
        && elementBounding.right >= targetBounding.left
      )
    }

    return (
      // relative to the viewport/window
      elementBounding.top <= viewportSize.height
      && elementBounding.left <= viewportSize.width
      && elementBounding.bottom >= 0
      && elementBounding.right >= 0
    )
  })

  if (scrollTarget) {
    useEventListener(
      scrollTarget,
      'scroll',
      elementBounding.update,
      { passive: true },
    )
  }

  return elementIsVisible
}
