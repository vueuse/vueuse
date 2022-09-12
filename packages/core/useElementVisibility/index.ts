import type { MaybeComputedRef } from '@vueuse/shared'
import { computed } from 'vue-demi'
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

  const elementBounding = useElementBounding(element)
  const targetBounding = useElementBounding(scrollTarget)
  const viewportSize = useWindowSize({
    // pass down the `configurableWindow`
    ...options,
    includeScrollbar: false,
  })

  const elementIsVisible = computed<boolean>(() => {
    if (scrollTarget) {
      // relative to the `scrollTarget`
      return elementBounding.top.value <= targetBounding.bottom.value
      && elementBounding.left.value <= targetBounding.right.value
      && elementBounding.bottom.value >= targetBounding.top.value
      && elementBounding.right.value >= targetBounding.left.value
    }
    return (
      // relative to the viewport/window
      elementBounding.top.value <= viewportSize.height.value
        && elementBounding.left.value <= viewportSize.width.value
        && elementBounding.bottom.value >= 0
        && elementBounding.right.value >= 0
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
