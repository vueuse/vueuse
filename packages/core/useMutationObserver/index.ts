import type { MaybeRefOrGetter } from '@vueuse/shared'
import { notNullish, toValue, tryOnScopeDispose } from '@vueuse/shared'
import { computed, watch } from 'vue-demi'
import type { MaybeComputedElementRef, MaybeElement } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import { useSupported } from '../useSupported'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export interface UseMutationObserverOptions extends MutationObserverInit, ConfigurableWindow {}

/**
 * Watch for changes being made to the DOM tree.
 *
 * @see https://vueuse.org/useMutationObserver
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver MutationObserver MDN
 * @param target
 * @param callback
 * @param options
 */
export function useMutationObserver(
  target: MaybeComputedElementRef | MaybeComputedElementRef[] | MaybeRefOrGetter<MaybeElement[]>,
  callback: MutationCallback,
  options: UseMutationObserverOptions = {},
) {
  const { window = defaultWindow, ...mutationOptions } = options
  let observer: MutationObserver | undefined
  const isSupported = useSupported(() => window && 'MutationObserver' in window)

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = undefined
    }
  }

  const targets = computed(() => {
    const value = toValue(target)
    const items = (Array.isArray(value) ? value : [value])
      .map(unrefElement)
      .filter(notNullish)
    return new Set(items)
  })

  const stopWatch = watch(
    () => targets.value,
    (targets) => {
      cleanup()

      if (isSupported.value && targets.size) {
        observer = new MutationObserver(callback)
        targets.forEach(el => observer!.observe(el, mutationOptions))
      }
    },
    { immediate: true, flush: 'post' },
  )

  const takeRecords = () => {
    return observer?.takeRecords()
  }

  const stop = () => {
    cleanup()
    stopWatch()
  }

  tryOnScopeDispose(stop)

  return {
    isSupported,
    stop,
    takeRecords,
  }
}

export type UseMutationObserverReturn = ReturnType<typeof useMutationObserver>
