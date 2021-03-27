import { Fn, MaybeRef } from '@vueuse/shared'
import { Ref, ref, unref } from 'vue-demi'
import { tryOnUnmounted } from '../tryOnUnmounted'
import { isClient } from '../utils'

export interface TimeoutFnResult {
  start: Fn
  stop: Fn
  isPending: Ref<boolean>
  /**
   * @deprecated use `isPending` instead
   */
  isActive: Ref<boolean>
}

/**
 * Wrapper for `setTimeout` with controls.
 *
 * @param cb
 * @param interval
 * @param immediate
 */
export function useTimeoutFn(
  cb: (...args: unknown[]) => any,
  interval?: MaybeRef<number>,
  immediate = true,
): TimeoutFnResult {
  const isPending = ref(false)

  let timer: number | null = null

  function clear() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function stop() {
    isPending.value = false
    clear()
  }

  function start(...args: unknown[]) {
    clear()
    isPending.value = true
    timer = setTimeout(() => {
      isPending.value = false
      timer = null
      // eslint-disable-next-line node/no-callback-literal
      cb(...args)
    }, unref(interval)) as unknown as number
  }

  if (immediate) {
    isPending.value = true
    if (isClient)
      start()
  }

  tryOnUnmounted(stop)

  return {
    isPending,
    start,
    stop,
    isActive: isPending,
  }
}
