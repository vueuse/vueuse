import type { MaybeRefOrGetter } from '@vueuse/shared'
import { ref } from 'vue-demi'
import type { MaybeComputedElementRef } from '../unrefElement'
import { useIntersectionObserver } from '../useIntersectionObserver'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export interface UseElementVisibilityOptions extends ConfigurableWindow {
  scrollTarget?: MaybeRefOrGetter<HTMLElement | undefined | null>
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
  { window = defaultWindow, scrollTarget }: UseElementVisibilityOptions = {},
) {
  const elementIsVisible = ref(false)

  useIntersectionObserver(
    element,
    ([{ isIntersecting }]) => {
      elementIsVisible.value = isIntersecting
    },
    {
      root: scrollTarget,
      window,
    },
  )

  return elementIsVisible
}
