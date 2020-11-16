import { ref, unref, watch } from 'vue-demi'
import { MaybeRef, tryOnUnmounted } from '@vueuse/shared'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export interface IntersectionObserverOptions extends ConfigurableWindow {
  /**
   * The Element or Document whose bounds are used as the bounding box when testing for intersection.
   */
  root?: MaybeRef<Element|null|undefined>

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
 * @param options
 */
export function useIntersectionObserver(
  target: MaybeRef<Element | null | undefined>,
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
  const targetRef = ref(target)
  const isSupported = window && 'IntersectionObserver' in window

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = undefined
    }
  }

  const stopWatch = watch(targetRef, (newValue) => {
    cleanup()

    if (isSupported && window && newValue) {
      // @ts-expect-error missing type
      observer = new window.IntersectionObserver(
        callback,
        {
          root: unref(root),
          rootMargin,
          threshold,
        },
      )
      observer!.observe(newValue)
    }
  })

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
