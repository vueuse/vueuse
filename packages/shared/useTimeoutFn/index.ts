import { ref } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'
import { tryOnScopeDispose } from '../tryOnScopeDispose'
import type { Stoppable } from '../utils'
import { isClient } from '../utils'

export interface TimeoutFnOptions {
  /**
   * Start the timer immediate after calling this function
   *
   * @default true
   */
  immediate?: boolean
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
  interval: MaybeComputedRef<number>,
  options: TimeoutFnOptions = {},
): Stoppable {
  const {
    immediate = true,
  } = options

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

      cb(...args)
    }, resolveUnref(interval)) as unknown as number
  }

  if (immediate) {
    isPending.value = true
    if (isClient)
      start()
  }

  tryOnScopeDispose(stop)

  return {
    isPending,
    start,
    stop,
  }
}
