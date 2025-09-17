import type { MaybeRefOrGetter } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import type { MaybeComputedElementRef } from '../unrefElement'
import { noop, watchOnce } from '@vueuse/shared'
import { shallowRef, toValue, watchEffect } from 'vue'
import { defaultWindow } from '../_configurable'
import { useIntersectionObserver } from '../useIntersectionObserver'

export interface UseElementVisibilityOptions extends ConfigurableWindow {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin
   */
  rootMargin?: MaybeRefOrGetter<string>
  /**
   * The threshold at which the element is considered visible.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds
   * @default 0
   */
  threshold?: MaybeRefOrGetter<number | number[]>
  /**
   * The element that is used as the viewport for checking visibility of the target.
   */
  scrollTarget?: MaybeRefOrGetter<HTMLElement | undefined | null>
  /**
   * Stop tracking when element visibility changes for the first time
   *
   * @default false
   */
  once?: boolean
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
    once = false,
  } = options

  const elementIsVisible = shallowRef(false)

  let cleanup = noop

  watchEffect((onCleanup) => {
    // Clean up previous observer
    cleanup()

    const currentRootMargin = toValue(rootMargin)
    const currentThreshold = toValue(threshold)
    const currentScrollTarget = toValue(scrollTarget)

    const { stop } = useIntersectionObserver(
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

        if (once) {
          watchOnce(elementIsVisible, () => {
            stop()
          })
        }
      },
      {
        root: currentScrollTarget,
        window,
        threshold: currentThreshold,
        rootMargin: currentRootMargin,
      },
    )

    cleanup = stop
    onCleanup(() => stop())
  })

  return elementIsVisible
}

export type UseElementVisibilityReturn = ReturnType<typeof useElementVisibility>
