import type { MaybeRefOrGetter, ShallowRef } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import type { MaybeComputedElementRef } from '../unrefElement'
import type { UseIntersectionObserverOptions, UseIntersectionObserverReturn } from '../useIntersectionObserver'
import { watchOnce } from '@vueuse/shared'
import { shallowRef, toValue } from 'vue'
import { defaultWindow } from '../_configurable'
import { useIntersectionObserver } from '../useIntersectionObserver'

export interface UseElementVisibilityOptions<Controls extends boolean = false> extends ConfigurableWindow, Pick<UseIntersectionObserverOptions, 'threshold'> {
  /**
   * Initial value.
   *
   * @default false
   */
  initialValue?: boolean
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin
   */
  rootMargin?: MaybeRefOrGetter<string>
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
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls
}

/**
 * Tracks the visibility of an element within the viewport.
 *
 * @see https://vueuse.org/useElementVisibility
 */
export function useElementVisibility(
  element: MaybeComputedElementRef,
  options?: UseElementVisibilityOptions<false>
): UseElementVisibilityReturn<false>
export function useElementVisibility(
  element: MaybeComputedElementRef,
  options?: UseElementVisibilityOptions<true>
): UseElementVisibilityReturn<true>
export function useElementVisibility(
  element: MaybeComputedElementRef,
  options: UseElementVisibilityOptions<boolean> = {},
): UseElementVisibilityReturn<boolean> {
  const {
    window = defaultWindow,
    scrollTarget,
    threshold = 0,
    rootMargin,
    once = false,
    initialValue = false,
  } = options
  const isVisible = shallowRef(initialValue)

  const observerController = useIntersectionObserver(
    element,
    (intersectionObserverEntries) => {
      let isIntersecting = isVisible.value

      // Get the latest value of isIntersecting based on the entry time
      let latestTime = 0
      for (const entry of intersectionObserverEntries) {
        if (entry.time >= latestTime) {
          latestTime = entry.time
          isIntersecting = entry.isIntersecting
        }
      }
      isVisible.value = isIntersecting

      if (once) {
        watchOnce(isVisible, () => {
          observerController.stop()
        })
      }
    },
    {
      root: scrollTarget,
      window,
      threshold,
      rootMargin: toValue(rootMargin),
    },
  )

  return options.controls
    ? { ...observerController, isVisible }
    : isVisible
}

export type UseElementVisibilityReturn<Controls extends boolean = false>
  = Controls extends true
    ? UseIntersectionObserverReturn & { isVisible: ShallowRef<boolean> }
    : ShallowRef<boolean>
