import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { ConfigurableWindow } from '../_configurable'
import type { MaybeComputedElementRef } from '../unrefElement'
import type { UseIntersectionObserverOptions } from '../useIntersectionObserver'
import { ref, toValue } from 'vue'
import { defaultWindow } from '../_configurable'
import { useIntersectionObserver } from '../useIntersectionObserver'

export interface UseElementVisibilityOptions extends ConfigurableWindow, Pick<UseIntersectionObserverOptions, 'threshold'> {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin
   */
  rootMargin?: MaybeRefOrGetter<string>
  /**
   * The element that is used as the viewport for checking visibility of the target.
   */
  scrollTarget?: MaybeRefOrGetter<HTMLElement | undefined | null>
}

/**
 * Tracks the visibility of an element within the viewport.
 *
 * @see https://vueuse.org/useElementVisibility
 */
export function useElementVisibility(
  element: MaybeComputedElementRef,
  options: UseElementVisibilityOptions = {},
) {
  const {
    window = defaultWindow,
    scrollTarget,
    threshold = 0,
    rootMargin,
  } = options
  const elementIsVisible = ref(false)

  useIntersectionObserver(
    element,
    (intersectionObserverEntries) => {
      let isIntersecting = elementIsVisible.value

      // Get the latest value of isIntersecting based on the entry time
      let latestTime = 0
      for (const entry of intersectionObserverEntries) {
        if (entry.time >= latestTime) {
          latestTime = entry.time
          isIntersecting = entry.isIntersecting
        }
      }
      elementIsVisible.value = isIntersecting
    },
    {
      root: scrollTarget,
      window,
      threshold,
      rootMargin: toValue(rootMargin),
    },
  )

  return elementIsVisible
}
