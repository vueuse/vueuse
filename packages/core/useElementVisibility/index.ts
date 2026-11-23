import type { MaybeRefInitials, ReadonlyRefs } from '@vueuse/shared'
import type { ShallowRef } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import type { MaybeComputedElementRef } from '../unrefElement'
import type { UseIntersectionObserverOptions, UseIntersectionObserverReturn } from '../useIntersectionObserver'
import { watchOnce } from '@vueuse/shared'
import { shallowReadonly, shallowRef } from 'vue'
import { defaultWindow } from '../_configurable'
import { useIntersectionObserver } from '../useIntersectionObserver'

export interface UseElementVisibilityState {
  /**
   * Whether the target is currently visible in the viewport
   *
   * @default false
   */
  isVisible: boolean
}

export interface UseElementVisibilityOptions<Controls extends boolean = false> extends ConfigurableWindow, Pick<UseIntersectionObserverOptions, 'rootMargin' | 'threshold'> {
  /**
   * Initial values for the returned state, used before the first intersection.
   * A passed ref is used as the internal state.
   */
  initials?: MaybeRefInitials<UseElementVisibilityState>
  /**
   * @deprecated Use `initials.isVisible` instead. Will be removed in v17.
   */
  initialValue?: boolean
  /**
   * The element that is used as the viewport for checking visibility of the target.
   */
  scrollTarget?: UseIntersectionObserverOptions['root']
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

export type UseElementVisibilityReturn<Controls extends boolean = false>
  = Controls extends true
    ? UseElementVisibilityReturnWithControls
    : Readonly<ShallowRef<boolean>>

export interface UseElementVisibilityReturnWithControls extends UseIntersectionObserverReturn, ReadonlyRefs<UseElementVisibilityState> {}

/**
 * Tracks the visibility of an element within the viewport.
 *
 * @see https://vueuse.org/useElementVisibility
 */
export function useElementVisibility(
  element: MaybeComputedElementRef,
  options?: UseElementVisibilityOptions<false>,
): UseElementVisibilityReturn<false>
export function useElementVisibility(
  element: MaybeComputedElementRef,
  options?: UseElementVisibilityOptions<true>,
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
    initialValue: deprecatedInitialValue,
    initials: {
      isVisible: initialIsVisible = deprecatedInitialValue ?? false,
    } = {},
  } = options
  const isVisible = shallowRef(initialIsVisible)

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
      rootMargin,
    },
  )

  const readonlyIsVisible = shallowReadonly(isVisible)

  return options.controls
    ? { ...observerController, isVisible: readonlyIsVisible }
    : readonlyIsVisible
}
