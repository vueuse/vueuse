import type { Ref } from 'vue-demi'
import { ref, watch } from 'vue-demi'
import type { MaybeRefOrGetter, Pausable } from '@vueuse/shared'
import { noop, toValue, tryOnScopeDispose } from '@vueuse/shared'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'
import type { MaybeComputedElementRef, MaybeElement } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import { useSupported } from '../useSupported'

export interface UseIntersectionObserverOptions extends ConfigurableWindow {
  /**
   * Start the IntersectionObserver immediately on creation
   *
   * @default true
   */
  immediate?: boolean

  /**
   * The Element or Document whose bounds are used as the bounding box when testing for intersection.
   */
  root?: MaybeComputedElementRef

  /**
   * A string which specifies a set of offsets to add to the root's bounding_box when calculating intersections.
   */
  rootMargin?: string

  /**
   * Either a single number or an array of numbers between 0.0 and 1.
   */
  threshold?: number | number[]
}

export interface UseIntersectionObserverReturn extends Pausable {
  isSupported: Ref<boolean>
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
  target: MaybeComputedElementRef | MaybeRefOrGetter<MaybeElement[]>,
  callback: IntersectionObserverCallback,
  options: UseIntersectionObserverOptions = {},
): UseIntersectionObserverReturn {
  const {
    root,
    rootMargin = '0px',
    threshold = 0.1,
    window = defaultWindow,
    immediate = true,
  } = options

  const isSupported = useSupported(() => window && 'IntersectionObserver' in window)

  let cleanup = noop
  const isActive = ref(immediate)

  const stopWatch = isSupported.value
    ? watch(
      () => [target, unrefElement(root), isActive.value] as const,
      ([newTarget, root]) => {
        cleanup()
        const plain = toValue(newTarget)
        const isArray = Array.isArray(plain)
        const el = !isArray ? unrefElement(newTarget as MaybeComputedElementRef) : undefined

        if (!isActive.value)
          return

        if ((!isArray && !el) || !el)
          return

        const observer = new IntersectionObserver(
          callback,
          {
            root: unrefElement(root),
            rootMargin,
            threshold,
          },
        )

        isArray
          ? plain.forEach((e) => {
            const el = unrefElement(e)
            if (el)
              observer.observe(el)
          })
          : observer.observe(el)

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
