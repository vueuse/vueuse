import type { Pausable } from '@vueuse/shared'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import type { MaybeComputedElementRef, MaybeElement } from '../unrefElement'
import { noop, notNullish, toArray, tryOnScopeDispose } from '@vueuse/shared'
import { computed, shallowRef, toValue, watch } from 'vue'
import { defaultWindow } from '../_configurable'
import { unrefElement } from '../unrefElement'
import { useSupported } from '../useSupported'

declare global {
  // Augment the type b/c typescript 5.9 lib.dom does not include
  // definitions for the these options yet.
  interface IntersectionObserverInit {
    delay?: number
    scrollMargin?: string
    trackVisibility?: boolean
  }
}

export interface UseIntersectionObserverOptions extends ConfigurableWindow {
  /**
   * Start the IntersectionObserver immediately on creation
   *
   * @default true
   */
  immediate?: boolean

  /**
   * A number specifying the minimum permitted delay between notifications from the observer, in milliseconds.
   */
  delay?: number

  /**
   * The Element or Document whose bounds are used as the bounding box when testing for intersection.
   */
  root?: MaybeComputedElementRef | Document

  /**
   * A string which specifies a set of offsets to add to the root's bounding_box when calculating intersections.
   */
  rootMargin?: string

  /**
   * A string that specifies the offsets to add to every scroll container on path to the target when calculating intersections.
   */
  scrollMargin?: string

  /**
   * Either a single number or an array of numbers between 0.0 and 1.
   * @default 0
   */
  threshold?: number | number[]

  /**
   * A boolean indicating whether the observer should track visibility.
   */
  trackVisibility?: boolean
}

export interface UseIntersectionObserverReturn extends Pausable {
  isSupported: ComputedRef<boolean>
  stop: () => void
}

/**
 * Detects that a target element's visibility.
 *
 * @see https://vueuse.org/useIntersectionObserver
 * @param target
 * @param callback
 * @param options
 */
export function useIntersectionObserver(
  target: MaybeComputedElementRef | MaybeRefOrGetter<MaybeElement[]> | MaybeComputedElementRef[],
  callback: IntersectionObserverCallback,
  options: UseIntersectionObserverOptions = {},
): UseIntersectionObserverReturn {
  const {
    delay = 0,
    root,
    rootMargin = '0px',
    scrollMargin = '0px',
    threshold = 0,
    trackVisibility = false,
    window = defaultWindow,
    immediate = true,
  } = options

  const isSupported = useSupported(() => window && 'IntersectionObserver' in window)
  const targets = computed(() => {
    const _target = toValue(target)
    return toArray(_target).map(unrefElement).filter(notNullish)
  })

  let cleanup = noop
  const isActive = shallowRef(immediate)

  const stopWatch = isSupported.value
    ? watch(
        () => [targets.value, unrefElement(root as MaybeComputedElementRef), isActive.value] as const,
        ([targets, root]) => {
          cleanup()
          if (!isActive.value)
            return

          if (!targets.length)
            return

          const observer = new IntersectionObserver(
            callback,
            {
              delay,
              root: unrefElement(root),
              rootMargin,
              scrollMargin,
              threshold,
              trackVisibility,
            },
          )

          targets.forEach(el => el && observer.observe(el))

          cleanup = () => {
            observer.disconnect()
            cleanup = noop
          }
        },
        { immediate, flush: 'post' },
      )
    : noop

  const stop = () => {
    cleanup()
    stopWatch()
    isActive.value = false
  }

  tryOnScopeDispose(stop)

  return {
    isSupported,
    isActive,
    pause() {
      cleanup()
      isActive.value = false
    },
    resume() {
      isActive.value = true
    },
    stop,
  }
}
