import { MaybeRef, tryOnUnmounted } from '@vueuse/shared'
import { ref, watch } from 'vue-demi'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export interface MutationObserverOptions extends MutationObserverInit, ConfigurableWindow {}

/**
 * Watch for changes being made to the DOM tree.
 *
 * @see   {@link https://vueuse.js.org/useMutationObserver}
 * @see   {@link https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver|MutationObserver MDN}
 * @param el
 * @param callback
 * @param options
 */
export function useMutationObserver(
  el: MaybeRef<HTMLElement | null | undefined>,
  callback: MutationCallback,
  options: MutationObserverOptions = {},
) {
  const { window = defaultWindow, ...mutationOptions } = options
  const elRef = ref(el)
  let observer: MutationObserver | undefined
  const isSupported = window && 'IntersectionObserver' in window

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = undefined
    }
  }

  const stopWatch = watch(
    elRef,
    (newEl) => {
      cleanup()

      if (isSupported && window && newEl) {
        // @ts-expect-error missing type
        observer = new window.MutationObserver(callback)
        observer!.observe(newEl, mutationOptions)
      }
    },
    { immediate: true },
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
