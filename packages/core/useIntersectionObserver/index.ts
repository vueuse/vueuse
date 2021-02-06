import { watch } from 'vue-demi'
import { tryOnUnmounted } from '@vueuse/shared'
import { ConfigurableWindow, defaultWindow } from '../_configurable'
import { MaybeElementRef, unrefElement } from '../unrefElement'

export interface IntersectionObserverOptions extends ConfigurableWindow {
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
 * @see   {@link https://vueuse.js.org/useIntersectionObserver}
 * @param target
 * @param callback
 * @param options
 */
export function useIntersectionObserver(
  target: MaybeElementRef,
  callback: IntersectionObserverCallback,
  options: IntersectionObserverOptions = {},
) {
  const {
    root,
    rootMargin = '0px',
    threshold = 0.1,
    window = defaultWindow,
  } = options

  let observer: IntersectionObserver | undefined
  const isSupported = window && 'IntersectionObserver' in window

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = undefined
    }
  }

  const stopWatch = watch(
    () => unrefElement(target),
    (el) => {
      cleanup()

      if (isSupported && window && el) {
      // @ts-expect-error missing type
        observer = new window.IntersectionObserver(
          callback,
          {
            root: unrefElement(root),
            rootMargin,
            threshold,
          },
        )
        observer!.observe(el)
      }
    },
    { immediate: true, flush: 'post' },
  )

  const stop = () => {
    cleanup()
    stopWatch()
  }

  tryOnUnmounted(stop)

  return {
    isSupported,
    stop,
  }
}
