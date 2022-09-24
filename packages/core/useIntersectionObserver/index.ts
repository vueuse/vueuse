import { watch } from 'vue-demi'
import { noop, tryOnScopeDispose } from '@vueuse/shared'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'
import type { MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import { useSupported } from '../useSupported'

export interface UseIntersectionObserverOptions extends ConfigurableWindow {
  /**
   * The Element or Document whose bounds are used as the bounding box when testing for intersection.
   */
  root?: MaybeElementRef

  /**
   * A string which specifies a set of offsets to add to the root's bounding_box when calculating intersections.
   */
  rootMargin?: string

  /**
   * Either a single number or an array of numbers between 0.0 and 1.
   */
  threshold?: number | number[]
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
  target: MaybeElementRef,
  callback: IntersectionObserverCallback,
  options: UseIntersectionObserverOptions = {},
) {
  const {
    root,
    rootMargin = '0px',
    threshold = 0.1,
    window = defaultWindow,
  } = options

  const isSupported = useSupported(() => window && 'IntersectionObserver' in window)

  let cleanup = noop

  const stopWatch = isSupported.value
    ? watch(
      () => ({
        el: unrefElement(target),
        root: unrefElement(root),
      }),
      ({ el, root }) => {
        cleanup()

        if (!el)
          return

        const observer = new IntersectionObserver(
          callback,
          {
            root,
            rootMargin,
            threshold,
          },
        )
        observer.observe(el)

        cleanup = () => {
          observer.disconnect()
          cleanup = noop
        }
      },
      { immediate: true, flush: 'post' },
    )
    : noop

  const stop = () => {
    cleanup()
    stopWatch()
  }

  tryOnScopeDispose(stop)

  return {
    isSupported,
    stop,
  }
}

export type UseIntersectionObserverReturn = ReturnType<typeof useIntersectionObserver>
