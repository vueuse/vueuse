import { isRef, ref, watch } from 'vue-demi'
import { resolveUnref } from '../resolveUnref'
import { tryOnScopeDispose } from '../tryOnScopeDispose'
import type { Fn, MaybeComputedRef, Pausable } from '../utils'
import { isClient, isFunction } from '../utils'

export interface UseIntervalFnOptions {
  /**
   * Start the timer immediately
   *
   * @default true
   */
  immediate?: boolean

  /**
   * Execute the callback immediate after calling this function
   *
   * @default false
   */
  immediateCallback?: boolean
}

/**
 * Wrapper for `setInterval` with controls
 *
 * @param cb
 * @param interval
 * @param options
 */
export function useIntervalFn(cb: Fn, interval: MaybeComputedRef<number> = 1000, options: UseIntervalFnOptions = {}): Pausable {
  const {
    immediate = true,
    immediateCallback = false,
  } = options

  let timer: ReturnType<typeof setInterval> | null = null
  const isActive = ref(false)

  function clean() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function pause() {
    isActive.value = false
    clean()
  }

  function resume() {
    const intervalValue = resolveUnref(interval)
    if (intervalValue <= 0)
      return
    isActive.value = true
    if (immediateCallback)
      cb()
    clean()
    timer = setInterval(cb, intervalValue)
  }

  if (immediate && isClient)
    resume()

  if (isRef(interval) || isFunction(interval)) {
    const stopWatch = watch(interval, () => {
      if (isActive.value && isClient)
        resume()
    })
    tryOnScopeDispose(stopWatch)
  }

  tryOnScopeDispose(pause)

  return {
    isActive,
    pause,
    resume,
  }
}
